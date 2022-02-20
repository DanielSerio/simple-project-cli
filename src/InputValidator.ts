import { CommandFlag } from './CommandFlag'

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

  public isValid = (inputArgs: string[]): boolean => {
    if (inputArgs.length < 3) return false
    // Check if user input project name is valid
    if (!this.isUrlSafe(inputArgs[2])) return false
    // Check if project type flag is valid
    const projectInput = inputArgs[3]
    if (!this.hasValidFlagFormat(projectInput)) return false
    if (this.projectFlagsArray.includes(projectInput)) return false
    const projectFlag = this._flags.filter((f: CommandFlag) => f.short === projectInput || f.full === projectInput)[0]
    if (!projectFlag.subFlags && inputArgs[4]) return false
    // TODO: loop through rest of arguments and check if they are valid subflags.

    return true
  }

  private isUrlSafe = (value: string): boolean => {
    return /^([a-z]|-|_|\d)+$/.test(value)
  }

  private hasValidFlagFormat = (value: string): boolean => {
    return /^(--\w+)|(-\w{1,2})$/.test(value)
  }
}
