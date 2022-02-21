import { CommandFlag } from './CommandFlag'
import { CreateCommand } from './CreateCommand'
import { BasicProjectFlag, CanvasProjectFlag, ReactProjectFlag } from './flags/project-type'
import { InputValidator, INVALID_REASON } from './InputValidator'

/**
 * The CLI class is the main entry point for the program. It creates a Command object and runs it.
 */
export class CLI {
  /* As of right now, CREATE is the only command. */
  private createCommand: CreateCommand
  private inputValidator: InputValidator
  private _flags: CommandFlag[]

  constructor () {
    const projectFlags = [
      new BasicProjectFlag(),
      new CanvasProjectFlag(),
      new ReactProjectFlag()
    ]

    this._flags = projectFlags
    this.createCommand = new CreateCommand(projectFlags)
    this.inputValidator = new InputValidator(projectFlags)
    const isValid: true|[false, INVALID_REASON] = this.inputValidator.isValid(this.args)
    if (isValid === true) {
      this.createCommand.run(this.args)
    } else {
      const [bool, reason] = isValid as [false, INVALID_REASON]
      console.error({ created: bool, reason })
      process.exit()
    }
  }

  public get args (): string[] {
    return process.argv.slice(2)
  }

  public print (): void {
    let projectType: string = 'basic'
    if (this.args.length > 1) {
      const provided: string = this.args[1]
      const projectTypeFlags: CommandFlag[] = this._flags.filter((f: CommandFlag) => {
        return (provided === f.short || provided === f.full)
      })

      if (projectTypeFlags.length) projectType = projectTypeFlags[0].value
    }

    console.log(`Creating ${projectType} project '${this.args[0]}'...`)
  }
}
