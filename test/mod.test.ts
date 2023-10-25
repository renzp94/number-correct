import { mod } from '../src'
import { expect, test } from 'bun:test'

test('0 % 2 = 0', () => {
  expect(mod(0, 2)).toBe('0')
})

test('2 % 0 = 0', () => {
  expect(() => mod(2, 0)).toThrow('被求余数不能为0')
})

test('1 % 2 = 0.5', () => {
  expect(mod(1, 2)).toBe('1')
})

test('8 % 3 = 2', () => {
  expect(mod(8, 3)).toBe('2')
})

test('8 % 2 = 0', () => {
  expect(mod(8, 2)).toBe('0')
})

test('0.8 % 0.2 = 0', () => {
  expect(mod(0.8, 0.2)).toBe('0')
})

test('0.8 % 0.3 = 0', () => {
  expect(mod(0.8, 0.3)).toBe('0.2')
})

test('0.8 % 0.003 = 0.002', () => {
  expect(mod(0.8, 0.003)).toBe('0.002')
})

test('2010 % 20 = 0', () => {
  expect(mod(2010, 20)).toBe('10')
})

test('458 % 236 = 222', () => {
  expect(mod(458, 236)).toBe('222')
})

test('0.999999 % 0.636666 = 0.363333', () => {
  expect(mod(0.999999, 0.636666)).toBe('0.363333')
})

test('0.999999 % 0.63666 = 0.363339', () => {
  expect(mod(0.999999, 0.63666)).toBe('0.363339')
})

test('4.58e2 % 2.36e2 = 222', () => {
  expect(mod(4.58e2, 2.36e2)).toBe('222')
})
