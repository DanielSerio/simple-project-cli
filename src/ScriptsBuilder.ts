import { readFileSync, writeFileSync } from 'fs'

interface Scripts {
  start: string
  test: string
  build: string
}

export class ScriptsBuilder {
  private _JSON: Scripts = {
    start: 'webpack serve --mode development',
    test: 'jest',
    build: 'webpack --mode production'
  }

  // eslint-disable-next-line no-useless-constructor
  constructor (public path: string) {}

  public get JSONValue (): string {
    let value: string = JSON.stringify(this._JSON)
    value = value.replace(/\{/, '{\n\t')
    value = value.replace(/,/, ',\n\t')
    return `${value.replace(/\}/, '\n}')},\n`
  }

  public async add (): Promise<void> {
    let fileData = await readFileSync(`${this.path}\\package.json`).toString('ascii')
    const startValue: string = '"license": "MIT",'
    fileData = fileData.replace(startValue, `${startValue}\n${this.JSONValue}`)
    await writeFileSync(`${this.path}\\package.json`, fileData)
  }
}
