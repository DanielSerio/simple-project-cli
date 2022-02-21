import { CommandFlag } from '../../CommandFlag'

export class BasicProjectFlag extends CommandFlag {
  constructor () {
    super('basic', 'b')
  }

  public get full (): string { return `--${this._name}` }

  public get short (): string {
    return `-${this._nameShort}`
  }
}
