import { RollingPolicy } from './rollingPolicy'
import { sum } from './util'

interface RtBucket {
  minRt: number
  total: number
  count: number
}

export class RollingRt extends RollingPolicy<RtBucket> {
  average(): RtBucket & { average: number } {
    const buckets = this.currentBuckets()
    const total = sum(buckets.map((b) => b.total))
    const count = sum(buckets.map((b) => b.count))

    return {
      total,
      count,
      minRt: Math.min(...buckets.map((b) => b.minRt)),
      average: count === 0 ? null : total / count,
    }
  }

  protected emptyBucketData(): RtBucket {
    return {
      minRt: Number.MAX_SAFE_INTEGER,
      total: 0,
      count: 0,
    }
  }

  protected addFunc(old: RtBucket, data: number): RtBucket {
    if (data < old.minRt) {
      old.minRt = data
    }
    old.count += 1
    old.total += data
    return old
  }
}
