import { Window } from './window'
import { hrtime } from './util'

export interface RollingPolicyOpts {
  bucketDuration: number // ms
}

type addFunc = (offset: number, val: number) => void

export class RollingPolicy {
  private size: number
  private window: Window
  private offset: number = 0
  private bucketDurationInNano: number
  private lastAppendTime: number

  constructor(window: Window, opts: RollingPolicyOpts) {
    this.window = window
    this.bucketDurationInNano = opts.bucketDuration * 1e6

    this.size = window.getSize()
    this.lastAppendTime = hrtime()
  }

  getWindow() {
    return this.window
  }

  timespan() {
    const v = Math.floor(
      (hrtime() - this.lastAppendTime) / this.bucketDurationInNano
    )
    if (v > -1) {
      return v
    }
    return this.size
  }

  add(val: number) {
    this.addByF(this.window.add.bind(this.window), val)
  }

  append(val: number) {
    this.addByF(this.window.append.bind(this.window), val)
  }

  currentBuckets() {
    const timespan = this.timespan()
    const count = this.size - timespan
    if (count > 0) {
      let offset = this.offset + timespan + 1
      if (offset >= this.size) {
        offset -= this.size
      }
      const res = []
      let cur = this.window.getBucket(offset)
      let i = 0
      while (i < count) {
        res.push(cur)
        cur = cur.next
        i += 1
      }
      return res
    }
    return []
  }

  private addByF(f: addFunc, val: number) {
    let timespan = this.timespan()
    if (timespan > 0) {
      this.lastAppendTime += timespan * this.bucketDurationInNano
      let offset = this.offset
      const s = offset + 1
      if (timespan > this.size) {
        timespan = this.size
      }
      let e = s + timespan
      let e1 = 0
      if (e > this.size) {
        e1 = e - this.size
        e = this.size
      }
      for (let i = s; i < e; i += 1) {
        this.window.resetBucket(i)
        offset = i
      }
      for (let i = 0; i < e1; i += 1) {
        this.window.resetBucket(i)
        offset = i
      }
      this.offset = offset
    }
    f(this.offset, val)
  }
}
