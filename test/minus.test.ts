import { minus } from '../src'
// @ts-ignore
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

test('6.3 - 1.1 - 2.023 = 3.177', () => {
  expect(minus(6.3, 1.1, 2.023)).toBe('3.177')
})

test('6 - 1.1 - 2.023 = 2.877', () => {
  expect(minus(6, 1.1, 2.023)).toBe('2.877')
})
