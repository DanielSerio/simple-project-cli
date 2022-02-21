import { CommandFlag } from './CommandFlag'

/**
 * Represents a cli command.
 */
export class Command {
  protected _name: string
  protected _flags?: CommandFlag[]

  constructor (name: string, flags?: CommandFlag[]) {
    this._name = name
    if (flags) this._flags = flags
  }

  public get flags (): undefined|CommandFlag[] {
    return this._flags
  }

  public get name (): string {
    return this._name
  }

  public async run (args: string[]): Promise<void> {

  }
}
