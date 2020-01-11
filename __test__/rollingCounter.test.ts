import { RollingCounter } from '../src/rollingCounter'
import { sleepMs } from '../src/util'

it('add should works well', async () => {
  const rc = new RollingCounter({ size: 3, bucketDuration: 1000 })
  expect(rc.currentPoints()).toEqual([[], [], []])
  rc.add(1)
  expect(rc.currentPoints()).toEqual([[], [], [1]])
  await sleepMs(1000)
  rc.add(2)
  rc.add(3)
  expect(rc.currentPoints()).toEqual([[], [1], [5]])
  await sleepMs(1000)
  rc.add(4)
  rc.add(5)
  rc.add(6)
  expect(rc.currentPoints()).toEqual([[1], [5], [15]])
  await sleepMs(1000)
  rc.add(7)
  expect(rc.currentPoints()).toEqual([[5], [15], [7]])
})

it('currentPoints should works well', async () => {
  const rc = new RollingCounter({ size: 3, bucketDuration: 1000 })
  for (let i = 0; i < 3; i += 1) {
    for (let j = 0; j <= i; j += 1) {
      rc.add(1)
    }
    if (i < 2) {
      await sleepMs(1000)
    }
  }
  const total = rc.currentPoints().reduce((prev, acc) => {
    return prev + acc[0]
  }, 0)
  expect(total).toBe(6)
})
