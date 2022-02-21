import { CommandFlag } from './CommandFlag'

export enum INVALID_REASON {
  ARGS_LEN = 'Invalid input. Too few arguments provided. Expected at least 3',
  URL_SAFE = 'Invalid input. \'project-name\' must be url-safe',
  FLAG_FORMAT = 'Invalid input. Invalid flag format',
  FLAG_NO_EXISTS = 'Invalid input. Flag not found',
  NO_SUBFLAGS = 'Invalid input. Previous flag does not have subflags'
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

  public isValid = (inputArgs: string[]): true|[false, INVALID_REASON] => {
    if (inputArgs.length < 3) return [false, INVALID_REASON.ARGS_LEN]
    // Check if user input project name is valid
    if (!this.isUrlSafe(inputArgs[2])) return [false, INVALID_REASON.URL_SAFE]
    // Check if project type flag is valid
    const projectInput = inputArgs[3]
    if (!this.hasValidFlagFormat(projectInput)) return [false, INVALID_REASON.FLAG_FORMAT]
    if (this.projectFlagsArray.includes(projectInput)) return [false, INVALID_REASON.FLAG_NO_EXISTS]
    const projectFlag = this._flags.filter((f: CommandFlag) => f.short === projectInput || f.full === projectInput)[0]
    if (!projectFlag.subFlags && inputArgs[4]) return [false, INVALID_REASON.NO_SUBFLAGS]
    const rest = inputArgs.slice(4)
    for (let i = 0; i < rest.length; i += 1) {
      if (!projectFlag.subFlagsArrs.includes(rest[i])) return [false, INVALID_REASON.FLAG_NO_EXISTS]
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
