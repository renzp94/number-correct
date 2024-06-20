export type Operation = (
  curr: number,
  next: number,
  result: number[],
  index: number,
  currList: number[],
  nextList: number[],
) => number[]

export { divide } from './divide'
export { minus } from './minus'
export { mod } from './mod'
export { plus } from './plus'
export { times } from './times'
export { toFixed } from './toFixed'
