import { plus } from '../src'
import { expect, test } from 'bun:test'

test('-1.1 + 2.023 = 0.923', () => {
  expect(plus(-1.1, 2.023)).toBe('0.923')
})

test('-1 + -2 + -3 = -6', () => {
  expect(plus(-1, -2, -3)).toBe('-6')
})

test('-0.111111111111111 + -0.222222222222222 + -0.000000000000000001 = -0.333333333333333001', () => {
  expect(
    plus('-0.111111111111111', '-0.222222222222222', '-0.000000000000000001'),
  ).toBe('-0.333333333333333001')
})

test('-0.111111111111111 + 0.222222222222222 + -0.000000000000000001 = 0.111111111111110999', () => {
  expect(
    plus('-0.111111111111111', '0.222222222222222', '-0.000000000000000001'),
  ).toBe('0.111111111111110999')
})

test('1 + 2 + 3 = 6', () => {
  expect(plus(1, 2, 3)).toBe('6')
})

test('0.1 + 0.2 + 0.3 = 0.6', () => {
  expect(plus(0.1, 0.2, 0.3)).toBe('0.6')
})

test('-1.09 + -1.91 + 1 = -2', () => {
  expect(plus('-1.09', '-1.91', 1)).toBe('-2')
})

test('0.111111111111111 + 0.222222222222222 + 0.000000000000000001 = 0.333333333333333001', () => {
  expect(
    plus('0.111111111111111', '0.222222222222222', '0.000000000000000001'),
  ).toBe('0.333333333333333001')
})

test('111111111111111111 + 222222222222222 + 333333333333333 = 111666666666666666', () => {
  expect(plus('111111111111111111', '222222222222222', '333333333333333')).toBe(
    '111666666666666666',
  )
})

test('1.09 + 1.91 + 1 = 4', () => {
  expect(plus('1.09', '1.91', 1)).toBe('4')
})

test('1.0000000334 + 99999999999999999 + 123 = 100000000000000123', () => {
  expect(plus('1.0000000334', '99999999999999999', 123)).toBe(
    '100000000000000123.0000000334',
  )
})

test('99 + 0.9999999999 + 0.0000000001 = 100', () => {
  expect(plus(99, '0.9999999999', '0.0000000001')).toBe('100')
})

test('1.0.9 + 1.91 + 1 error: 1.0.9不是一个数字', () => {
  expect(() => plus('1.0.9', '1.91', 1)).toThrow('1.0.9不是一个数字')
})

test('1.23e+20 + 2e+2 = 12300000000000000000200', () => {
  expect(plus('1.23e+20', 2e2)).toBe('12300000000000000000200')
})

test('1.23E+20 + 2E+2 = 12300000000000000000200', () => {
  expect(plus('1.23E+20', '2E+2')).toBe('12300000000000000000200')
})
