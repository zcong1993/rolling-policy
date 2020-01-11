import { RollingPolicy } from './rollingPolicy'
import { Window } from './window'

export interface RollingCounterOpts {
  size: number
  bucketDuration: number
}

export class RollingCounter {
  private policy: RollingPolicy

  constructor(opts: RollingCounterOpts) {
    const window = new Window(opts.size)
    this.policy = new RollingPolicy(window, {
      bucketDuration: opts.bucketDuration
    })
  }

  add(val: number) {
    this.policy.add(val)
  }

  timespan() {
    return this.policy.timespan()
  }

  currentBuckets() {
    return this.policy.currentBuckets()
  }

  currentPoints() {
    return this.currentBuckets().map(b => b.getPoints())
  }
}
