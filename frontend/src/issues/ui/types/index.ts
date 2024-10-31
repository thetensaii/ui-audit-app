type UIScreenshotSize = {
  width: number,
  height: number,
}

type UIElementRect = {
  x: number,
  y: number,
  width: number,
  height: number,
}

type UIIssue = {
  id:string,
  message: string,
  screenshotSize: UIScreenshotSize,
  elementRect: UIElementRect,
  screenshotUrl: string
}