/**
 * The CommandFlag class is used to represent a command line flag.
 **/
export class CommandFlag {
  private _name: string
  private _nameShort: string

  constructor (fullname: string, abbv: string) {
    this._name = fullname
    this._nameShort = abbv
  }

  public get full (): string { return `--${this._name}` }

  public get short (): string {
    return `-${this._nameShort}`
  }

  public get value (): string {
    return this._name
  }

  public get valueShort (): string {
    return this._nameShort
  }
}
