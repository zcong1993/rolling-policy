import { RollingRt } from '../src'

const sleep = (n: number) => new Promise((r) => setTimeout(r, n))

it('should work well', async () => {
  const rc = new RollingRt({ window: 1000, windowSize: 4 })

  expect(rc.average()).toEqual({
    minRt: Number.MAX_SAFE_INTEGER,
    total: 0,
    count: 0,
    average: null,
  })
  for (let i = 0; i < 10; i++) {
    rc.add(1)
    expect(rc.average().count).toBe(Math.min(i + 1, 4))
    expect(rc.average().total).toBe(Math.min(i + 1, 4))
    expect(rc.currentBuckets()).toMatchSnapshot()
    await sleep(250)
  }
})

it('minRt should work well', async () => {
  const rc = new RollingRt({ window: 200, windowSize: 2 })
  for (let i = 0; i < 2; i++) {
    rc.add(10 - i)
    expect(rc.average().minRt).toBe(10 - i)
    await sleep(100)
  }

  await sleep(200)

  for (let i = 0; i < 2; i++) {
    rc.add(10 + i)
    expect(rc.average().minRt).toBe(10)
    await sleep(100)
  }
})
