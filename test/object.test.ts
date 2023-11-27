import { VNumber } from '../src'
import { expect, test } from 'bun:test'

test('VNumber(1).plus(1) = 2', () => {
  const v = new VNumber(1)
  expect(v.plus(1).value).toBe('2')
})

test('VNumber(1).plus(1).plus(1) = 3', () => {
  const v = new VNumber(1)
  expect(v.plus(1).plus(1).value).toBe('3')
})

test('VNumber(1).plus(1,1,1) = 4', () => {
  const v = new VNumber(1)
  expect(v.plus(1, 1, 1).value).toBe('4')
})

test('VNumber(2).minus(1) = 1', () => {
  const v = new VNumber(2)
  expect(v.minus(1).value).toBe('1')
})

test('VNumber(3).minus(1).plus(1) = 1', () => {
  const v = new VNumber(3)
  expect(v.minus(1).minus(1).value).toBe('1')
})

test('VNumber(4).plus(1,1,1) = 1', () => {
  const v = new VNumber(4)
  expect(v.minus(1, 1, 1).value).toBe('1')
})

test('VNumber(2).minus(2) = 4', () => {
  const v = new VNumber(2)
  expect(v.times(2).value).toBe('4')
})

test('VNumber(2).times(2).times(2) = 8', () => {
  const v = new VNumber(2)
  expect(v.times(2).times(2).value).toBe('8')
})

test('VNumber(2).times(2,2,2) = 16', () => {
  const v = new VNumber(2)
  expect(v.times(2, 2, 2).value).toBe('16')
})

test('VNumber(4).divide(2) = 2', () => {
  const v = new VNumber(4)
  expect(v.divide(2).value).toBe('2')
})

test('VNumber(8).divide(2).divide(2) = 2', () => {
  const v = new VNumber(8)
  expect(v.divide(2).divide(2).value).toBe('2')
})

test('VNumber(16).divide(2,2,2) = 2', () => {
  const v = new VNumber(16)
  expect(v.divide(2, 2, 2).value).toBe('2')
})

test('VNumber(20, { divideConfigs: { precision: 0 } }).divide(3) = 7', () => {
  const a = new VNumber(20, { divideConfigs: { precision: 0 } })
  expect(a.divide(3).value).toBe('7')
})

test('VNumber(20).setConfigs({ divideConfigs: { precision: 0 } }).divide(3).divide(3) = 7', () => {
  const a = new VNumber(20)
  expect(
    a.setConfigs({ divideConfigs: { precision: 0 } }).divide(3).value,
  ).toBe('7')
})

test('VNumber(1).plus(1).minus(2).plus(2).times(3).plus(2).divide(2) = 4', () => {
  const v = new VNumber(1)
  expect(v.plus(1).minus(2).plus(2).times(3).plus(2).divide(2).value).toBe('4')
})

test('VNumber(5.33333).toFixed(2) = 5.33', () => {
  const v = new VNumber(5.33333)
  expect(v.toFixed(2).value).toBe('5.33')
})

test('VNumber(5).mod(2) = 1', () => {
  const v = new VNumber(5)
  expect(v.mod(2).value).toBe('1')
})

test('VNumber(1).compared(2) = -1', () => {
  const v = new VNumber(1)
  expect(v.compared(2)).toBe(-1)
})

test('VNumber(1).compared(1) = 0', () => {
  const v = new VNumber(1)
  expect(v.compared(1)).toBe(0)
})

test('VNumber(1).compared(0) = 1', () => {
  const v = new VNumber(1)
  expect(v.compared(0)).toBe(1)
})

test('VNumber(1).isGreat(2) = false', () => {
  const v = new VNumber(1)
  expect(v.isGreat(2)).toBe(false)
})

test('VNumber(1).isLess(2) = true', () => {
  const v = new VNumber(1)
  expect(v.isLess(2)).toBe(true)
})

test('VNumber(1).isLess(1) = true', () => {
  const v = new VNumber(1)
  expect(v.isEqual(1)).toBe(true)
})

test('VNumber(1).isGreatEqual(2) = false', () => {
  const v = new VNumber(1)
  expect(v.isGreatEqual(2)).toBe(false)
})

test('VNumber(2).isGreatEqual(1) = true', () => {
  const v = new VNumber(2)
  expect(v.isGreatEqual(1)).toBe(true)
})

test('VNumber(1).isGreatEqual(2) = true', () => {
  const v = new VNumber(1)
  expect(v.isLessEqual(2)).toBe(true)
})

test('VNumber(1).VNumber(1) = 2', () => {
  const a = new VNumber(1)
  const b = new VNumber(1)
  expect(a.plus(b).value).toBe('2')
})
