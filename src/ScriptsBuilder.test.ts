import { ScriptsBuilder } from './ScriptsBuilder'

describe('ScriptsBuilder', () => {
  test('should get JSON value', () => {
    expect(new ScriptsBuilder(process.cwd()).JSONValue).toBeTruthy()
  })

  test('should have line breaks', () => {
    console.log(new ScriptsBuilder(process.cwd()).JSONValue)
    expect(new ScriptsBuilder(process.cwd()).JSONValue.split('')).toContain('\n')
  })
})
