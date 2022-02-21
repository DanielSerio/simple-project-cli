/* eslint-disable no-unused-vars */
import { CommandFlag } from './CommandFlag'

export enum INVALID_REASON {
  ARGS_LEN = 'Invalid input. Too few arguments provided. Expected at least 3',
  URL_SAFE = 'Invalid input. \'project-name\' must be url-safe',
  FLAG_FORMAT = 'Invalid input. Invalid flag format',
  FLAG_NO_EXISTS = 'Invalid input. Flag not found'
}

export class InputValidator {
  private _flags: CommandFlag[]
  constructor (projectFlags: CommandFlag[]) {
    this._flags = projectFlags
  }

  public get projectFlagsArray (): string[] {
    const values: string[] = []

    for (let i = 0; i < this._flags.length; i += 1) {
      values.push(this._flags[i].full)
      values.push(this._flags[i].short)
    }

    return values
  }

  /**
   * Check if user input args are valid. Expects nodePath and filepath to be stripped.
   * @returns {true|[false, INVALID_REASON]} true|[false, INVALID_REASON]
   * */
  public isValid = (inputArgs: string[]): true|[false, INVALID_REASON] => {
    const len: number = inputArgs.length
    if (!len) return [false, INVALID_REASON.ARGS_LEN]
    // Check if user input project name is valid
    if (!this.isUrlSafe(inputArgs[0])) return [false, INVALID_REASON.URL_SAFE]
    // Check if project type flag is valid
    if (len > 1) {
      const projectTypeName = inputArgs[1]
      if (!this.hasValidFlagFormat(projectTypeName)) return [false, INVALID_REASON.FLAG_FORMAT]
      if (!this.projectFlagsArray.includes(projectTypeName)) return [false, INVALID_REASON.FLAG_NO_EXISTS]
      const projectFlagIndex: number = this._flags.findIndex((f: CommandFlag) => {
        const { short, full } = f
        return [short, full].includes(projectTypeName)
      })
      if (projectFlagIndex < 0) return [false, INVALID_REASON.FLAG_NO_EXISTS]
      const projectFlag = this._flags[projectFlagIndex]
      if ((!projectFlag || !projectFlag.subFlags) && inputArgs[2]) return [false, INVALID_REASON.FLAG_NO_EXISTS]
      const rest = inputArgs.slice(2)
      for (let i = 0; i < rest.length; i += 1) {
        if (!projectFlag.subFlagsArrs.includes(rest[i])) return [false, INVALID_REASON.FLAG_NO_EXISTS]
      }
    }
    return true
  }

  private isUrlSafe = (value: string): boolean => {
    return /^([a-z]|-|_|\d)+$/.test(value)
  }

  private hasValidFlagFormat = (value: string): boolean => {
    return /^(--\w+)|(-\w{1,2})$/.test(value)
  }
}
