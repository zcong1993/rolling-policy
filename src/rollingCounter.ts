import { RollingPolicy } from './rollingPolicy'
import { sum } from './util'

type CounterBucket = number[]

export class RollingCounter extends RollingPolicy<CounterBucket> {
  getCounter() {
    return this.currentBuckets().reduce((prev, acc) => prev + sum(acc), 0)
  }

  protected emptyBucketData(): CounterBucket {
    return []
  }

  protected addFunc(old: CounterBucket, data: number): CounterBucket {
    old.push(data)
    return old
  }
}
