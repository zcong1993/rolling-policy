import { Window } from '../src/window'
import { RollingPolicy } from '../src/rollingPolicy'
import { sleepMs } from '../src/util'

const createRollingPolicy = () => {
  const window = new Window(10)
  return new RollingPolicy(window, { bucketDuration: 300 })
}

interface Fixture {
  sleep: number
  offset: number
  vals: number[]
}

it('add should works well', async () => {
  const rp = createRollingPolicy()
  await sleepMs(400)
  rp.add(1)
  await sleepMs(210)
  rp.add(1)

  expect(
    rp
      .getWindow()
      .getBucket(1)
      .getPoints()
  ).toEqual([1])
  expect(
    rp
      .getWindow()
      .getBucket(2)
      .getPoints()
  ).toEqual([1])
  const fixtures: Fixture[][] = [
    [
      {
        sleep: 294,
        offset: 0,
        vals: [1]
      },
      {
        sleep: 3200,
        offset: 0,
        vals: [1]
      }
    ],
    [
      {
        sleep: 305,
        offset: 1,
        vals: [1]
      },
      {
        sleep: 3200,
        offset: 1,
        vals: [1]
      },
      {
        sleep: 6400,
        offset: 1,
        vals: [1]
      }
    ]
  ]

  for (const fixtureGroup of fixtures) {
    const rp = createRollingPolicy()
    for (const fixture of fixtureGroup) {
      await sleepMs(fixture.sleep)
      rp.add(1)
      expect(
        rp
          .getWindow()
          .getBucket(fixture.offset)
          .getPoints()
      ).toEqual(fixture.vals)
    }
  }
}, 15000)
