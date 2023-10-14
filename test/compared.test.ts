import {
  compared,
  isEqual,
  isGreat,
  isGreatEqual,
  isLess,
  isLessEqual,
} from '../src'
// @ts-ignore
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
