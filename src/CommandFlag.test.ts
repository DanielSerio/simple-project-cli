import { CommandFlag } from './CommandFlag'

describe('CommandFlag', () => {
  class TestFlag extends CommandFlag {}
  test('should have a \'full\' attr', () => {
    expect(new TestFlag('react', 'r').full).toBe('--react')
  })

  test('should have a \'short\' attr', () => {
    expect(new TestFlag('react', 'r').short).toBe('-r')
  })
})
