export class InputValidator {
  public static isValid = (inputArgs: string[]): boolean => {
    if (inputArgs.length < 3) return false
    // Check if user input project name is valid
    if (!this.isUrlSafe(inputArgs[2])) return false
    // TODO: check if 2nd user input is a valid project-type tag
    // TODO: if there are more userInputs, check to see if they are valid tags.
    return true
  }

  private static isUrlSafe = (value: string): boolean => {
    return /^([a-z]|-|_|\d)+$/.test(value)
  }
}
