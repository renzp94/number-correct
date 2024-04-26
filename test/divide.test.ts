import { divide } from '../src'
import { expect, test } from 'bun:test'

test('0 / 2 = 0', () => {
  expect(divide(0, [2])).toBe('0')
})

test('2 / 0 error: 被除数不能为0', () => {
  expect(() => divide(2, [0])).toThrow('被除数不能为0')
})

test('1 / 2 = 0.5', () => {
  expect(divide(1, [2])).toBe('0.5')
})

test('8 / 2 = 4', () => {
  expect(divide(8, [2])).toBe('4')
})

test('8 / 2 / 2 = 2', () => {
  expect(divide(8, [2, 2])).toBe('2')
})

test('420 / 20 = 21', () => {
  expect(divide(420, [20])).toBe('21')
})

test('4220 / 20 = 211', () => {
  expect(divide(4220, [20])).toBe('211')
})

test('4221 / 20 = 211.05', () => {
  expect(divide(4221, [20])).toBe('211.05')
})

test('5666 / 20 / 30 = 9.4433333333', () => {
  expect(divide(5666, [20, 30])).toBe('9.4433333333')
})

test('8 / 3 = 2.66666666666666666667', () => {
  expect(divide(8, [3], { precision: 20 })).toBe('2.66666666666666666667')
})

test('8 / 3 = 2.66666666666666666666', () => {
  expect(divide(8, [3], { precision: 20, rounded: false })).toBe(
    '2.66666666666666666666',
  )
})

test('3 / 8 = 0.375', () => {
  expect(divide(3, [8])).toBe('0.375')
})

test('8.45 / 3.26 = 2.5920245399', () => {
  expect(divide(8.45, [3.26])).toBe('2.5920245399')
})

test('8 / 0.02 = 400', () => {
  expect(divide(8, [0.02])).toBe('400')
})

test('0.08 / 2 = 0.04', () => {
  expect(divide(0.08, [2])).toBe('0.04')
})

test('0.08 / 0.2 = 0.4', () => {
  expect(divide(0.08, [0.2])).toBe('0.4')
})

test('0.08 / 0.3 = 0.2666666667', () => {
  expect(divide(0.08, [0.3])).toBe('0.2666666667')
})

test('8 / 0.3 = 26.6666666666', () => {
  expect(divide(8, [0.3], { rounded: false })).toBe('26.6666666666')
})

test('8 / 3 = 2.6666666667', () => {
  expect(divide(8, [3])).toBe('2.6666666667')
})

test('8 / 3 = 2.6666666667', () => {
  expect(divide(8, [3])).toBe('2.6666666667')
})

test('1 / 100000000000 = 0.0000000001', () => {
  expect(divide(1, [10000000000])).toBe('0.0000000001')
})

// 超过精度移除
test('1 / 1000000000000 = 0', () => {
  expect(divide(1, [1000000000000])).toBe('0')
})

test('0.30.0 / 0.23 error: 0.30.0不是一个数字', () => {
  expect(() => divide('0.30.0', ['0.23'])).toThrow('0.30.0不是一个数字')
})

test('4.2e2 / 20 = 21', () => {
  expect(divide(4.2e2, [20])).toBe('21')
})

test('8e-2 / 0.3 = 0.2666666667', () => {
  expect(divide(8e-2, [0.3])).toBe('0.2666666667')
})

test('"8e-2" / 0.3 = 0.2666666667', () => {
  expect(divide('8e-2', [0.3])).toBe('0.2666666667')
})

test('-1 / 0.2 = -5', () => {
  expect(divide(-1, [0.2])).toBe('-5')
})
