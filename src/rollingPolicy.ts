import debug from 'debug'
import cloneDeep from 'clone-deep'
import { Hrtime, hrtime2nano, ms2nano, sum } from './util'

const db = debug('rolling-policy')

export interface Opt {
  window: number // ms, full time window
  windowSize: number // window split bucket size
}

export abstract class RollingPolicy<T> {
  protected windowDuration: number
  protected lastUpdatedAt: Hrtime
  protected startTime: Hrtime
  protected buffer: T[]
  protected opt: Opt

  constructor(c: Opt) {
    this.opt = {
      window: ms2nano(c.window),
      windowSize: c.windowSize,
    }
    this.windowDuration = this.opt.window / this.opt.windowSize
    this.lastUpdatedAt = process.hrtime()
    this.startTime = process.hrtime()

    this.buffer = []
    for (let i = 0; i < c.windowSize; i++) {
      const empty = this.emptyBucketData()
      this.buffer.push(empty)
    }
    db(this)
  }

  add(d: any) {
    this.dropExpired()
    const o = this.offset()
    this.buffer[this.mapIndex(o)] = this.addFunc(
      this.buffer[this.mapIndex(o)],
      d
    )

    db(`index: ${o}, ${this.mapIndex(o)}`)
    this.updatelastUpdatedAt()
  }

  currentBuckets() {
    this.dropExpired()
    return cloneDeep(this.buffer)
  }

  abstract emptyBucketData(): T
  abstract addFunc(old: T, data: any): T

  protected dropExpired() {
    const duration = hrtime2nano(process.hrtime(this.lastUpdatedAt))
    const offset = this.offset()
    const lastOffset = this.lastOffset()
    db(`duration: ${duration}`)
    // reset all
    if (duration > this.opt.window) {
      db('reset all')
      for (let i = 0; i < this.opt.windowSize; i++) {
        this.buffer[i] = this.emptyBucketData()
      }
      return
    }

    const left = offset - this.opt.windowSize
    const lastLeft = lastOffset - this.opt.windowSize
    db(`${lastOffset}, ${offset}, clean: [${lastLeft + 1}, ${left}]`)
    for (let i = lastLeft + 1; i <= left; i++) {
      const mappedIndex = this.mapIndex(i)
      if (mappedIndex >= 0) {
        this.buffer[mappedIndex] = this.emptyBucketData()
      }
    }
  }

  protected updatelastUpdatedAt() {
    this.lastUpdatedAt = process.hrtime()
  }

  protected lastOffset() {
    const o = Math.floor(
      (hrtime2nano(this.lastUpdatedAt) - hrtime2nano(this.startTime)) /
        this.windowDuration
    )
    return o
  }

  protected offset() {
    const diff = hrtime2nano(process.hrtime(this.startTime))
    const o = Math.floor(diff / this.windowDuration)
    return o
  }

  protected mapIndex(i: number) {
    return i % this.opt.windowSize
  }
}
