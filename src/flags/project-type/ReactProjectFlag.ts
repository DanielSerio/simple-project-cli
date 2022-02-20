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
}
