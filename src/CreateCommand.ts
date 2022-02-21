/* eslint-disable node/no-path-concat */
import { execSync } from 'child_process'
import { closeSync, copyFileSync, existsSync, mkdirSync, openSync, readFileSync, writeFileSync } from 'fs'
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
  private _scriptsBuilder!: ScriptsBuilder
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
    const copySass = async (): Promise<void> => {
      return await this.copyDirTo(resolve(__dirname, '..\\templates\\scss'), `${process.cwd()}\\src\\scss`)
    }
    this.setDeps(args)
    this._scriptsBuilder = new ScriptsBuilder(`${process.cwd()}\\${args[0]}`)
    await this.createDir(args[0])
    await this.chDir(args[0])
    await this.initNPM()
    await this._scriptsBuilder.add()
    await this.installDependancies()
    await this.createDir('src')
    await this.copyWebpack(args[1] !== undefined && (args[1] === '-r' || args[1] === '--react'))
    if (args[1] === undefined || (args[1] === '--basic' || args[1] === '-b')) {
      const filePath: string = resolve(`${__dirname}`, '..\\templates\\basic\\basic.ts')
      const dest: string = resolve(`${process.cwd()}\\src\\index.ts`)
      if (await existsSync(filePath)) {
        if (!await existsSync(dest)) {
          const data = await readFileSync(filePath, { encoding: 'ascii' })
          await closeSync(openSync(dest, 'w'))
          await writeFileSync(dest, data)
        }
      }
      await copySass()
    }
    if (args[1] === '--canvas' || args[1] === '-c') {
      const filePath: string = resolve(`${__dirname}`, '..\\templates\\basic\\canvas.ts')
      const dest: string = resolve(`${process.cwd()}\\src\\index.ts`)
      if (await existsSync(filePath)) {
        if (!await existsSync(dest)) {
          const data = await readFileSync(filePath, { encoding: 'ascii' })
          await closeSync(openSync(dest, 'w'))
          await writeFileSync(dest, data)
        }
      }
      await copySass()
    }

    if (args[1] === '--react' || args[1] === '-r') {
      const rest = args.slice(2)
      const shortIndex: number = rest.indexOf('-rr')
      const longIndex: number = rest.indexOf('--router')
      if (shortIndex + longIndex === -2) {
        await this.copyDirTo(resolve(__dirname, '..\\templates\\react\\react-basic'), `${process.cwd()}\\src`)
          .then(copySass)
      } else {
        await this.copyDirTo(resolve(__dirname, '..\\templates\\react\\react-router'), `${process.cwd()}\\src`)
          .then(copySass)
      }
    }
    await this.copyHTML(args[0])
    await this.copyTSConfig(args[1] === '-r' || args[1] === '--react')
  }

  private async copyHTML (title: string): Promise<void> {
    const filePath: string = resolve(`${__dirname}`, '..\\templates\\template.html')
    const value = await readFileSync(filePath).toString()
    await writeFileSync(`${process.cwd()}\\src\\index.html`, value.replace(/<title>#####<\/title>/gmi, `<title>${title}</title>`))
  }

  private async copyWebpack (react?: boolean): Promise<void> {
    const filePath: string = resolve(`${__dirname}`, `..\\templates\\${react ? 'react' : 'basic'}`, 'webpack.config.js')
    await execSync(`copy "${filePath}" "${process.cwd()}\\webpack.config.js"`)
  }

  private async copyDirTo (path: string, dest: string): Promise<void> {
    try {
      await execSync(`robocopy ${path} ${dest} /e`)
    } catch (e) {
      console.log((e as any).output.toString())
      if ((e as any).status !== 1) process.exit()
    }
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
    if (deps && deps.length > 0) {
      await execSync(`yarn add ${deps.join(' ')}`)
    }
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

  private async copyTSConfig (react?: boolean): Promise<void> {
    const filePath: string = resolve(`${__dirname}`, `..\\templates\\${react ? 'react' : 'basic'}`, 'tsconfig.json')
    await execSync(`copy "${filePath}" "${process.cwd()}\\tsconfig.json"`)
  }
}
