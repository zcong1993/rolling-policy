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

// const sleep = (n: number) => new Promise(r => setTimeout(r, n))

// const rc = new RollingCounter({ size: 3, bucketDuration: 1000 })

// const run = async () => {
//   console.log(rc.currentPoints())
//   rc.add(1)
//   console.log(rc.currentPoints())
//   await sleep(1000)
//   rc.add(2)
//   rc.add(3)
//   console.log(rc.currentPoints())
//   await sleep(1000)
//   rc.add(4)
//   rc.add(5)
//   rc.add(6)
//   console.log(rc.currentPoints())
//   await sleep(1000)
//   rc.add(7)
//   console.log(rc.currentPoints())
// }

// run()
