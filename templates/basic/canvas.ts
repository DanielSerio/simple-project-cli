import './scss/style.scss'
window.addEventListener('load', onLoad)

type Context = CanvasRenderingContext2D
type Point = [number, number]
type ResizeCanvas = () => Point
type BasicFunction = (() => void)
type CallbackFunction = ((callback: BasicFunction) => void)

export interface ContextFunctions {
  save: CallbackFunction
  draw: CallbackFunction
  clear: BasicFunction
}

/**
 * It creates a canvas element and appends it to the parent element. It also returns a context and a
 * function that resizes the canvas to the size of the parent element
 * @param {HTMLElement} parent - The parent element where the canvas will be appended to.
 * @returns {[Context, ResizeCanvas]} The canvas context and a function that resizes the canvas to the size of the parent
 * element.
 */
function createCanvas (parent: HTMLElement): [Context, ResizeCanvas] {
  /**
   * It resizes the canvas to the size of the parent element.
   * @returns {Point} The canvas dimensions.
   */
  function resizeCanvas (): [number, number] {
    const { clientHeight, clientWidth } = parent
    canvas.height = clientHeight
    canvas.width = clientWidth
    return [clientWidth, clientHeight]
  }

  const canvas: HTMLCanvasElement = document.createElement('canvas')
  const ctx: Context = canvas.getContext('2d') as Context

  resizeCanvas()
  parent.appendChild(canvas)

  return [ctx, resizeCanvas]
}

/**
 * It creates a context function object that has the functions save, draw and clear.
 * @param {Context} ctx - Context - The context of the canvas.
 * @returns {ContextFunctions} `ContextFunctions` object. {@link ContextFunctions}
 */
function getContextFunctions (ctx: Context): ContextFunctions {
  /**
   * It saves the current state of the canvas and then calls the callback function.
   * @param callback - A function that will be called after the context is saved.
   * @returns {void} None
   */
  function save (callback: () => void): void {
    ctx.save()
    callback()
    ctx.restore()
  }

  /**
   * It draws a shape.
   * @param callback - A function that will be called to draw the shape.
   * @returns {void} None
   */
  function draw (callback: () => void): void {
    ctx.beginPath()
    callback()
    ctx.closePath()
  }

  /**
   * Clear the canvas by clearing the rectangle that represents it
   * @returns {void} None
   */
  function clear (): void {
    const { width, height } = ctx.canvas
    ctx.clearRect(0, 0, width, height)
  }

  return {
    save,
    draw,
    clear
  }
}

/**
 * onLoad function.
 * @returns {void} None
 */
function onLoad (): void {

}
