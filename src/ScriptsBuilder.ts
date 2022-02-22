import { readFileSync, writeFileSync } from 'fs'

export class ScriptsBuilder {
  // eslint-disable-next-line no-useless-constructor
  constructor (public path: string) {}

  public get JSONValue (): string {
    return `{
      start: 'webpack serve --mode development',
      test: 'jest',
      build: 'webpack --mode production'
    },`
  }

  public async add (): Promise<void> {
    let fileData = await readFileSync(`${this.path}\\package.json`).toString('ascii')
    const startValue: string = '"license": "MIT",'
    fileData = fileData.replace(startValue, `${startValue}\n${this.JSONValue}`)
    await writeFileSync(`${this.path}\\package.json`, fileData)
  }
}
