import { CommandFlag } from './CommandFlag'
import { InputValidator, INVALID_REASON } from './InputValidator'
import { BasicProjectFlag, CanvasProjectFlag, ReactProjectFlag } from './flags/project-type'
describe('InputValidator', () => {
  const flags: CommandFlag[] = [
    new BasicProjectFlag(),
    new CanvasProjectFlag(),
    new ReactProjectFlag()
  ]
  const validator: InputValidator = new InputValidator(flags)
  console.log(flags[0].full)

  test('should return false if too few arguments', () => {
    const testArgs: string[] = []
    const isValid: true|[false, INVALID_REASON] = validator.isValid(testArgs)
    if (typeof isValid === 'boolean') expect(true).toBe(false)
    const [bool, reason] = isValid as [false, INVALID_REASON]
    expect(bool).toBe(false)
    expect(reason).toBe(INVALID_REASON.ARGS_LEN)
  })

  test('should return false if third argument is not url-safe', () => {
    const testArgs: string[] = ['project name']
    const isValid: true|[false, INVALID_REASON] = validator.isValid(testArgs)
    if (typeof isValid === 'boolean') expect(true).toBe(false)
    const [bool, reason] = isValid as [false, INVALID_REASON]
    expect(bool).toBe(false)
    expect(reason).toBe(INVALID_REASON.URL_SAFE)
  })

  test('should return false if project type argument is not a valid flag', () => {
    const testArgs: string[] = ['project-name', '-*f']
    const isValid: true|[false, INVALID_REASON] = validator.isValid(testArgs)
    if (typeof isValid === 'boolean') expect(true).toBe(false)
    const [bool, reason] = isValid as [false, INVALID_REASON]
    expect(bool).toBe(false)
    expect(reason).toBe(INVALID_REASON.FLAG_FORMAT)
  })

  test('should return false if project type is not a valid project flag', () => {
    const testArgs: string[] = ['project-name', '--nope']
    const isValid: true|[false, INVALID_REASON] = validator.isValid(testArgs)
    if (typeof isValid === 'boolean') expect(true).toBe(false)
    const [bool, reason] = isValid as [false, INVALID_REASON]
    expect(bool).toBe(false)
    expect(reason).toBe(INVALID_REASON.FLAG_NO_EXISTS)
  })

  test('should return false if additional argument is provided when `project-type` does not have subflags', () => {
    const testArgs: string[] = ['project-name', '--basic', '--nope']
    const isValid: true|[false, INVALID_REASON] = validator.isValid(testArgs)
    if (typeof isValid === 'boolean') expect(true).toBe(false)
    const [bool, reason] = isValid as [false, INVALID_REASON]
    expect(bool).toBe(false)
    expect(reason).toBe(INVALID_REASON.FLAG_NO_EXISTS)
  })

  test('should return false if additional argument provided is not a valid subflag of `project-type`', () => {
    const testArgs: string[] = ['project-name', '--react', '--color']
    const isValid: true|[false, INVALID_REASON] = validator.isValid(testArgs)
    if (typeof isValid === 'boolean') expect(true).toBe(false)
    const [bool, reason] = isValid as [false, INVALID_REASON]
    expect(bool).toBe(false)
    expect(reason).toBe(INVALID_REASON.FLAG_NO_EXISTS)
  })

  test('should return true if valid', () => {
    const testArgs: string[] = ['project-name']
    expect(validator.isValid([...testArgs])).toBe(true)
    console.log([...testArgs, '--basic'])
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
