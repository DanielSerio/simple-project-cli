import { execSync } from 'child_process'
import { existsSync, mkdirSync, readFileSync } from 'fs'
import { chdir } from 'process'
import { CommandFlag } from './CommandFlag'
import { ScriptsBuilder } from './ScriptsBuilder'
import { resolve } from 'path'
import { Command } from './Command'
/**
 * Represents a cli command.
 * @param
 */
export class CreateCommand extends Command {
  private _scriptsBuilder: ScriptsBuilder = new ScriptsBuilder(process.cwd())
  public dependancies: string[] = []
  public devDependancies: string[] = [
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

  constructor (flags?: CommandFlag[]) {
    super('CREATE', flags)
  }

  public get flags (): undefined|CommandFlag[] {
    return this._flags
  }

  public get name (): string {
    return this._name
  }

  public async run (args: string[]): Promise<void> {
    this.setDeps(args)
    await this.createDir(args[0])
    await this.chDir(args[0])
    await this.initNPM()
    await this._scriptsBuilder.add()
    await this.installDependancies()
    await this.copyWebpack(args[1] !== undefined && (args[1] === '-r' || args[1] === '--react'))
    await this.copyDirTo(resolve(__dirname, '..\\templates\\scss'), `${process.cwd()}\\scss`)
    if (!args[1] || (args[1] === '--basic' || args[1] === '-b')) {
      await this.copyDirTo(resolve(__dirname, '..\\templates\\basic'), `${process.cwd()}\\src`)
    }
    if (!args[1] || (args[1] === '--canvas' || args[1] === '-c')) {
      await this.copyDirTo(resolve(__dirname, '..\\templates\\canvas'), `${process.cwd()}\\src`)
    }

    if (!args[1] || (args[1] === '--react' || args[1] === '-r')) {
      const rest = args.slice(2)
      const shortIndex: number = rest.indexOf('-rr')
      const longIndex: number = rest.indexOf('--router')
      if (shortIndex + longIndex === -2) {
        await this.copyDirTo(resolve(__dirname, '..\\templates\\react\\react-basic'), `${process.cwd()}\\src`)
      } else {
        await this.copyDirTo(resolve(__dirname, '..\\templates\\react\\react-router'), `${process.cwd()}\\src`)
      }
    }

    await this.copyHTML(args[0])
  }

  private async copyHTML (title: string): Promise<void> {
    // eslint-disable-next-line node/no-path-concat
    const filePath: string = resolve(`${__dirname}\\templates\\template.html`)
    const value = await readFileSync(filePath).toString()
    value.replace('#####', title)
    await execSync(`copy ${filePath} ${process.cwd()}\\webpack.config.js`)
  }

  private async copyWebpack (react?: boolean): Promise<void> {
    // eslint-disable-next-line node/no-path-concat
    const filePath: string = resolve(`${__dirname}\\templates\\${react ? 'react' : 'basic'}`, 'webpack.config.js')
    await execSync(`copy ${filePath} ${process.cwd()}\\webpack.config.js`)
  }

  private async copyDirTo (path: string, dest: string): Promise<void> {
    await execSync(`xcopy ${path} ${dest} /s /e`)
  }

  private setDeps = (args: string[]): void => {
    if (args.includes('-r') || args.includes('--react')) {
      this.dependancies.push('react')
      this.dependancies.push('react-dom')
      this.dependancies.push('react-icons')
      this.devDependancies.push('@types/react')
      this.devDependancies.push('@types/react-dom')
    }
    if (args.includes('-rr') || args.includes('--router')) {
      this.dependancies.push('react-router-dom')
      this.devDependancies.push('@types/react-router-dom')
    }
    if (args.includes('-rf') || args.includes('--forms')) {
      this.dependancies.push('react-hook-form')
    }
  }

  private async installDependancies (): Promise<void> {
    const deps = this.dependancies
    const devDeps = this.devDependancies
    if (deps) await execSync(`yarn add ${deps.join(' ')}`)
    await execSync(`yarn add --dev ${devDeps.join(' ')}`)
  }

  private async createDir (path: string): Promise<void> {
    const exists: boolean = await existsSync(path)
    if (!exists) await mkdirSync(path)
  }

  private async chDir (dir: string): Promise<void> {
    await chdir(dir)
  }

  private async initNPM (): Promise<void> {
    await execSync('yarn init -y')
  }
}
