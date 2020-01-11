export const hrtime2nano = (hrtime: [number, number]): number =>
  hrtime[0] * 1e9 + hrtime[1]

export const hrtime = () => hrtime2nano(process.hrtime())

export const sleepMs = (n: number) => new Promise(r => setTimeout(r, n))
