import { RollingPolicy } from './rollingPolicy'
import { sum } from './util'

type CounterBucket = number[]

export class RollingCounter extends RollingPolicy<CounterBucket> {
  emptyBucketData(): CounterBucket {
    return []
  }

  addFunc(old: CounterBucket, data: number): CounterBucket {
    old.push(data)
    return old
  }

  getCounter() {
    super.dropExpired()
    return this.buffer.reduce((prev, acc) => prev + sum(acc), 0)
  }
}
