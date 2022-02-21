/**
 * The CommandFlag class is used to represent a command line flag.
 **/
export abstract class CommandFlag {
  protected _name: string
  protected _nameShort: string

  constructor (fullname: string, abbv: string, public subFlags?: CommandFlag[]) {
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

  public get subFlagsArrs (): string[] {
    if (!this.subFlags) return []

    const values: string[] = []

    for (let i = 0; i < this.subFlags.length; i += 1) {
      values.push(this.subFlags[i].full)
      values.push(this.subFlags[i].short)
    }

    return values
  }
}
