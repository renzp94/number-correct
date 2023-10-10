import { minus } from '../src'
// @ts-ignore
import { expect, test } from 'bun:test'

test('6 - 1 - 2 - 3 = 0', () => {
  expect(minus(6, 1, 2, 3)).toBe('0')
})

test('6.3 - 1.1 - 2.023 = 3.177', () => {
  expect(minus(6.3, 1.1, 2.023)).toBe('3.177')
})

test('6 - 1.1 - 2.023 = 2.877', () => {
  expect(minus(6, 1.1, 2.023)).toBe('2.877')
})
