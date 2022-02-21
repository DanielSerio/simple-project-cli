import { execSync } from 'child_process'
import { existsSync, mkdirSync } from 'fs'
import { chdir } from 'process'
import { Command } from './Command'
import { CommandFlag } from './CommandFlag'
import { BasicProjectFlag, CanvasProjectFlag, ReactProjectFlag } from './flags/project-type'
import { InputValidator, INVALID_REASON } from './InputValidator'
import { ScriptsBuilder } from './ScriptsBuilder'

/**
 * The CLI class is the main entry point for the program. It creates a Command object and runs it.
 */
export class CLI {
  /* As of right now, CREATE is the only command. */
  private createCommand: Command
  private inputValidator: InputValidator
  private _flags: CommandFlag[]
  private _scriptsBuilder: ScriptsBuilder = new ScriptsBuilder(process.cwd())

  constructor () {
    const projectFlags = [
      new BasicProjectFlag(),
      new CanvasProjectFlag(),
      new ReactProjectFlag()
    ]

    this._flags = projectFlags
    this.createCommand = new Command('CREATE', projectFlags)
    this.inputValidator = new InputValidator(projectFlags)
    const isValid: true|[false, INVALID_REASON] = this.inputValidator.isValid(this.args)
    if (isValid === true) {
      this.createCommand.run(this.args)
      this.createDir(this.args[0])
      this.chDir(this.args[0])
      this.initNPM()
      this._scriptsBuilder.add()
      this.installDependancies()
      // TODO: add eslintrc
      // TODO: add webpack config
      // TODO: add apropriate template dir
    } else {
      const [bool, reason] = isValid as [false, INVALID_REASON]
      console.error({ created: bool, reason })
      process.exit()
    }
  }

  private async installDependancies (): Promise<void> {
    const deps = this.dependancies
    const devDeps = this.devDependancies
    if (deps) await execSync(`yarn add ${deps.join(' ')}`)
    await execSync(`yarn add --dev ${devDeps.join(' ')}`)
  }

  private get devDependancies (): string[] {
    const base: string[] = [
      'typescript',
      'sass',
      'webpack',
      'webpack-cli',
      'webpack-dev-server',
      'ts-loader',
      'css-loader',
      'sass-loader',
      'html-webpack-plugin',
      'mini-css-extract-plugin'
    ]

    return base
  }

  private get dependancies (): string[]|false {
    const base: string[] = []

    if (base.length) return base
    return false
  }

  private async initNPM (): Promise<void> {
    await execSync('yarn init -y')
  }

  public get args (): string[] {
    return process.argv.slice(2)
  }

  private async createDir (path: string): Promise<void> {
    const exists: boolean = await existsSync(path)
    if (!exists) await mkdirSync(path)
  }

  private async chDir (dir: string): Promise<void> {
    await chdir(dir)
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
