import { Window } from '../src/window'

it('resetWindow should works well', () => {
  const window = new Window(3)
  Array(window.getSize())
    .fill(null)
    .map((_, i) => window.append(i, 1))
  window.resetWindow()
  Array(window.getSize())
    .fill(null)
    .map((_, i) => {
      expect(window.getBucket(i).getPoints().length).toBe(0)
    })
})

it('resetBucket should works well', () => {
  const window = new Window(3)
  Array(window.getSize())
    .fill(null)
    .map((_, i) => window.append(i, 1))
  window.resetBucket(1)
  expect(window.getBucket(0).getPoints()).toEqual([1])
  expect(window.getBucket(1).getPoints().length).toBe(0)
  expect(window.getBucket(2).getPoints()).toEqual([1])
})

it('append should works well', () => {
  const window = new Window(3)
  Array(window.getSize())
    .fill(null)
    .map((_, i) => window.append(i, 1))
  Array(window.getSize())
    .fill(null)
    .map((_, i) => {
      expect(window.getBucket(i).getPoints()).toEqual([1])
    })
})

it('add should works well', () => {
  const window = new Window(3)
  window.append(0, 1)
  window.add(0, 1)
  expect(window.getBucket(0).getPoints()).toEqual([2])
})

it('getSize should works well', () => {
  const window = new Window(3)
  expect(window.getSize()).toBe(3)
})
