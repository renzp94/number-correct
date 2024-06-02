import { toFixed } from '../src'
import { expect, test } from 'bun:test'

test('toFixed(0, 2) = 0.00', () => {
  expect(toFixed(0, 2)).toBe('0.00')
})

test('toFixed(123, 2) = 123.00', () => {
  expect(toFixed(123, 2)).toBe('123.00')
})

test('toFixed(123.125, 2) = 123.13', () => {
  expect(toFixed(123.125, 2)).toBe('123.13')
})

test('toFixed(123.123, 2) = 123.13', () => {
  expect(toFixed(123.123, 2)).toBe('123.12')
})

test('toFixed(123.123, 2) = 123.13', () => {
  expect(toFixed(123.123, 2)).toBe('123.12')
})

test('toFixed(1.23123e2, 2) = 123.13', () => {
  expect(toFixed(1.23123e2, 2)).toBe('123.12')
})

test('toFixed(1.123456, 0) = 1', () => {
  expect(toFixed(1.123456, 0)).toBe('1')
})

test('toFixed(1.789, 0) = 2', () => {
  expect(toFixed(1.789, 0)).toBe('2')
})

test('toFixed(-1.789, 0) = -2', () => {
  expect(toFixed(-1.789, 0)).toBe('-2')
})

test('toFixed(-0.123, 0) = 0', () => {
  expect(toFixed(-0.123, 0)).toBe('0')
})

test('toFixed(-0.789, 0) = -1', () => {
  expect(toFixed(-0.789, 0)).toBe('-1')
})

test('toFixed(5.666666, 2) = 5.67', () => {
  expect(toFixed(5.666666, 2)).toBe('5.67')
})

test('toFixed(5.666666, 2, false) = 5.66', () => {
  expect(toFixed(5.666666, 2, false)).toBe('5.66')
})
