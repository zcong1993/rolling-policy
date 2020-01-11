export class Bucket {
  private points: number[] = []
  private count: number = 0
  next?: Bucket

  append(val: number) {
    this.points.push(val)
    this.count += 1
  }

  add(offset: number, val: number) {
    this.points[offset] += val
    this.count += 1
  }

  reset() {
    this.points = []
    this.count = 0
  }

  getPoints() {
    return this.points
  }

  getCount() {
    return this.count
  }
}

export class Window {
  private window: Bucket[] = []
  private size: number = 0

  constructor(size: number) {
    this.size = size
    this.window = Array(size)
      .fill(null)
      .map(() => new Bucket())
    for (let i = 0; i < size; i += 1) {
      let nextI = i + 1
      if (nextI === size) {
        nextI = 0
      }
      this.window[i].next = this.window[nextI]
    }
  }

  resetWindow() {
    this.window.forEach(w => w.reset())
  }

  resetBucket(offset: number) {
    this.window[offset].reset()
  }

  append(offset: number, val: number) {
    this.window[offset].append(val)
  }

  add(offset: number, val: number) {
    if (this.window[offset].getCount() === 0) {
      this.window[offset].append(val)
    } else {
      this.window[offset].add(0, val)
    }
  }

  getBucket(offset: number) {
    return this.window[offset]
  }

  getBuckets() {
    return this.window
  }

  getSize() {
    return this.size
  }
}
