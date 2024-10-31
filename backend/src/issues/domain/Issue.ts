export type ElementRect = {
  x: number,
  y: number,
  width: number,
  height: number
}

export type ScreenshotSize = {
  width: number,
  height: number
}

export class Issue {
  constructor(
    public id: string,
    public message: string,
    public screenshotSize: ScreenshotSize,
    public elementRect: ElementRect,
    public screenshot: Buffer
  ){}
}
