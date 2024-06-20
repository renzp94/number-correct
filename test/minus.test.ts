import { minus } from '../src'
import { expect, test } from 'bun:test'

test('6 - -1 - 2 - -3 = 8', () => {
  expect(minus(6, -1, 2, -3)).toBe('8')
})

test('6.3 - -1.1 - -2.023 = 9.423', () => {
  expect(minus(6.3, -1.1, -2.023)).toBe('9.423')
})

test('6 - 1.1 - -2.023 = 6.923', () => {
  expect(minus(6, 1.1, -2.023)).toBe('6.923')
})

test('-6 - 1.1 - -2.023 = -5.077', () => {
  expect(minus(-6, 1.1, -2.023)).toBe('-5.077')
})

test('-6 - -1.1 - -2.023 = -2.877', () => {
  expect(minus(-6, -1.1, -2.023)).toBe('-2.877')
})

test('6 - 1 - 2 - 3 = 0', () => {
  expect(minus(6, 1, 2, 3)).toBe('0')
})

test('-6 - 1 - 2 - 3 = -12', () => {
  expect(minus(-6, 1, 2, 3)).toBe('-12')
})

test('-6 - -1 - -2 - -3 = -12', () => {
  expect(minus(-6, -1, -2, -3)).toBe('0')
})

test('6.3 - 1.1 - 2.023 = 3.177', () => {
  expect(minus(6.3, 1.1, 2.023)).toBe('3.177')
})

test('6 - 1.1 - 2.023 = 2.877', () => {
  expect(minus(6, 1.1, 2.023)).toBe('2.877')
})

test('16.0 - 3.26 = 12.74', () => {
  expect(minus(16.0, 3.26)).toBe('12.74')
})

test('30 - 3.26 = 26.74', () => {
  expect(minus(30, 3.26)).toBe('26.74')
})

test('30 - 1 = 29', () => {
  expect(minus(30, 1)).toBe('29')
})

test('0.08 - 3.26 = -3.18', () => {
  expect(minus(0.08, 3.26)).toBe('-3.18')
})

test('0.08 - -3.26 = 3.34', () => {
  expect(minus(0.08, -3.26)).toBe('3.34')
})

test('0.08 - -3.26 - a error: a不是一个数字', () => {
  expect(() => minus(0.08, -3.26, 'a')).toThrow('a不是一个数字')
})

test('8e-2 - -3.26 = 3.34', () => {
  expect(minus(8e-2, -3.26)).toBe('3.34')
})

test('63 - 1.111e1 - 2.023e-1 = 51.6877', () => {
  expect(minus(63, 1.111e1, 2.023e-1)).toBe('51.6877')
})
