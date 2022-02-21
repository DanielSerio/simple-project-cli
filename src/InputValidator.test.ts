import { CommandFlag } from './CommandFlag'
import { InputValidator } from './InputValidator'
import { BasicProjectFlag, CanvasProjectFlag, ReactProjectFlag } from './flags/project-type'
describe('InputValidator', () => {
  const flags: CommandFlag[] = [
    new BasicProjectFlag(),
    new CanvasProjectFlag(),
    new ReactProjectFlag()
  ]
  const validator: InputValidator = new InputValidator(flags)

  test('should return false if too few arguments', () => {
    const testArgs: string[] = ['...', '...2']
    expect(validator.isValid(testArgs)).toBe(false)
  })

  test('should return false if third argument is not url-safe', () => {
    const testArgs: string[] = ['...', '...2', '...3']
    expect(validator.isValid(testArgs)).toBe(false)
  })

  test('should return false if fourth argument is not a valid flag', () => {
    const testArgs: string[] = ['...', '...2', 'project-name', '-*f']
    expect(validator.isValid(testArgs)).toBe(false)
  })

  test('should return false if fourth argument is not a valid project flag', () => {
    const testArgs: string[] = ['...', '...2', 'project-name', '--nope']
    expect(validator.isValid(testArgs)).toBe(false)
  })

  test('should return false if fifth argument is provided when 4th argument does not have subflags', () => {
    const testArgs: string[] = ['...', '...2', 'project-name', '--basic', '--nope']
    expect(validator.isValid(testArgs)).toBe(false)
  })

  test('should return false if fifth argument provided is not a valid subflag of 4th argument', () => {
    const testArgs: string[] = ['...', '...2', 'project-name', '--react', '--color']
    expect(validator.isValid(testArgs)).toBe(false)
  })

  test('should return true if valid', () => {
    const testArgs: string[] = ['...', '...2', 'project-name']
    expect(validator.isValid([...testArgs])).toBe(true)
    expect(validator.isValid([...testArgs, '--basic'])).toBe(true)
    expect(validator.isValid([...testArgs, '-b'])).toBe(true)
    expect(validator.isValid([...testArgs, '--canvas'])).toBe(true)
    expect(validator.isValid([...testArgs, '-c'])).toBe(true)
    expect(validator.isValid([...testArgs, '--react'])).toBe(true)
    expect(validator.isValid([...testArgs, '-r'])).toBe(true)
    const reactArgs: string[] = [...testArgs, '-r']
    expect(validator.isValid([...reactArgs, '--forms'])).toBe(true)
    expect(validator.isValid([...reactArgs, '-rf'])).toBe(true)
    expect(validator.isValid([...reactArgs, '--router'])).toBe(true)
    expect(validator.isValid([...reactArgs, '-rr'])).toBe(true)
  })
})
