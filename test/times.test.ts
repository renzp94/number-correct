import { times } from '../src'
import { expect, test } from 'bun:test'

test('0 * 1 * 2 *  3 = 0', () => {
  expect(times(0, 1, 2, 3)).toBe('0')
})

test('0 * -1 * 2 *  3 = 0', () => {
  expect(times(0, -1, 2, 3)).toBe('0')
})

test('1 * 2 = 2', () => {
  expect(times(1, 2)).toBe('2')
})

test('1 * 2 * 3 * 4 = 24', () => {
  expect(times(1, 2, 3, 4)).toBe('24')
})

test('-1 * 2 * 3 * 4 = 24', () => {
  expect(times(-1, 2, 3, 4)).toBe('-24')
})

test('-1 * -2 * 3 * 4 = 24', () => {
  expect(times(-1, -2, 3, 4)).toBe('24')
})

test('123 * 245 * 123 = 3706605', () => {
  expect(times(123, 245, 123)).toBe('3706605')
})

test('0.2 * 0.3 = 0.06', () => {
  expect(times(0.2, 0.3)).toBe('0.06')
})

test('0.5 * 0.3 = 0.15', () => {
  expect(times(0.5, 0.3)).toBe('0.15')
})

test('0.25 * 8 = 2', () => {
  expect(times(0.25, 8)).toBe('2')
})

test('0.25 * 0.8 = 0.2', () => {
  expect(times(0.25, 0.8)).toBe('0.2')
})

test('0.5 * 0.3 * 4 = 0.6', () => {
  expect(times(0.5, 0.3, 4)).toBe('0.6')
})

test('0.5 * 1.3 * 4 = 2.6', () => {
  expect(times(0.5, 1.3, 4)).toBe('2.6')
})

test('2 * 1.222 * 2.3333 * 4.256 = 24.2702026112', () => {
  expect(times(2, 1.222, 2.3333, 4.256)).toBe('24.2702026112')
})

test('0.2222222222 * 0.5555555555 * 0.4444444444 = 0.05486968448285322359561042524', () => {
  expect(times(0.2222222222, 0.5555555555, 0.4444444444)).toBe(
    '0.05486968448285322359561042524',
  )
})
