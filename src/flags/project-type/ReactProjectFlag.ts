import { CommandFlag } from '../../CommandFlag'
import { FormsFlag } from '../react/FormsFlag'
import { RouterFlag } from '../react/RouterFlag'

export class ReactProjectFlag extends CommandFlag {
  constructor () {
    super('react', 'r', [
      new RouterFlag(),
      new FormsFlag()
    ])
  }

  public get full (): string { return `--${this._name}` }

  public get short (): string {
    return `-${this._nameShort}`
  }
}
