import { isEqual, isGreat, isGreatEqual, isLess, isLessEqual } from '../src'
import { expect, test } from 'bun:test'

test('0 = 0', () => {
  expect(isEqual(0, 0)).toBe(true)
})

test('-0 = 0', () => {
  expect(isEqual(-0, 0)).toBe(true)
})

test('0 = -0', () => {
  expect(isEqual(0, -0)).toBe(true)
})

test('1 = 1', () => {
  expect(isEqual(1, 1)).toBe(true)
})

test('1.00000 = 1', () => {
  expect(isEqual('1.00000', 1)).toBe(true)
})

test('1 = 1.0000', () => {
  expect(isEqual(1, '1.0000')).toBe(true)
})

test('99999999999999999999.11111 = 99999999999999999999.11111', () => {
  expect(
    isEqual('99999999999999999999.11111', '99999999999999999999.11111'),
  ).toBe(true)
})

test('-99999999999999999999.11111 = -99999999999999999999.11111', () => {
  expect(
    isEqual('-99999999999999999999.11111', '-99999999999999999999.11111'),
  ).toBe(true)
})

test('-99999999999999999999.11111 != -0.1199999999999999999999111', () => {
  expect(
    isEqual('-99999999999999999999.11111', '-0.1199999999999999999999111'),
  ).toBe(false)
})

test('2 > 1', () => {
  expect(isGreat(2, 1)).toBe(true)
})

test('-2 < 1', () => {
  expect(isGreat(-2, 1)).toBe(false)
})

test('1 > -2', () => {
  expect(isGreat(1, -2)).toBe(true)
})

test('-1 > -2', () => {
  expect(isGreat(-1, -2)).toBe(true)
})

test('-999999999.11111 > -9999999999.11111', () => {
  expect(isGreat('-999999999.11111', '-9999999999.11111')).toBe(true)
})

test('2 < 3', () => {
  expect(isLess(2, 3)).toBe(true)
})

test('-3 < -2', () => {
  expect(isLess(-3, -2)).toBe(true)
})

test('-10 < 1', () => {
  expect(isLess('-10', 1)).toBe(true)
})

test('1 > -1', () => {
  expect(isLess(1, -1)).toBe(false)
})

test('2 <= 3', () => {
  expect(isLessEqual(2, 3)).toBe(true)
})

test('-2 >= -3', () => {
  expect(isGreatEqual(-2, -3)).toBe(true)
})

test('0.08 < 3.26', () => {
  expect(isLess('00.08', '03.26')).toBe(true)
})

test('8.023 > 1.1', () => {
  expect(isGreatEqual(8.023, 1.1)).toBe(true)
})

test('322 < 326', () => {
  expect(isLess(322, 326)).toBe(true)
})

test('-3.02-3 > 0.3 error: -3.02-3不是一个数字', () => {
  expect(() => isLess('-3.02-3', 0.3)).toThrow('-3.02-3不是一个数字')
})

test('3.22e5 > 326e2', () => {
  expect(isGreat(3.22e5, 326e2)).toBe(true)
})

test('3.22e-5 < 326e-2', () => {
  expect(isLess(3.22e-5, 326e-2)).toBe(true)
})
