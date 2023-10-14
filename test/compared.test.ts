import { compared } from '../src'
// @ts-ignore
import { expect, test } from 'bun:test'

test('0 = 0', () => {
  expect(compared(0, 0)).toBe(0)
})

test('-0 = 0', () => {
  expect(compared(-0, 0)).toBe(0)
})

test('0 = -0', () => {
  expect(compared(0, -0)).toBe(0)
})

test('1 = 1', () => {
  expect(compared(1, 1)).toBe(0)
})

test('1.00000 = 1', () => {
  expect(compared('1.00000', 1)).toBe(0)
})

test('1 = 1.0000', () => {
  expect(compared(1, '1.0000')).toBe(0)
})

test('99999999999999999999.11111 = 99999999999999999999.11111', () => {
  expect(
    compared('99999999999999999999.11111', '99999999999999999999.11111'),
  ).toBe(0)
})

test('-99999999999999999999.11111 = -99999999999999999999.11111', () => {
  expect(
    compared('-99999999999999999999.11111', '-99999999999999999999.11111'),
  ).toBe(0)
})

test('2 > 1', () => {
  expect(compared(2, 1)).toBe(1)
})

test('-1 > -2', () => {
  expect(compared(-1, -2)).toBe(1)
})

test('-999999999.11111 > -9999999999.11111', () => {
  expect(compared('-999999999.11111', '-9999999999.11111')).toBe(1)
})

test('2 < 3', () => {
  expect(compared(2, 3)).toBe(-1)
})

test('-3 < -2', () => {
  expect(compared(-3, -2)).toBe(-1)
})
