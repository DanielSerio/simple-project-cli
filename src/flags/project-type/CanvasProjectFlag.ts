import { CommandFlag } from '../../CommandFlag'

export class CanvasProjectFlag extends CommandFlag {
  constructor () {
    super('canvas', 'c')
  }

  public get full (): string { return `--${this._name}` }

  public get short (): string {
    return `-${this._nameShort}`
  }
}
