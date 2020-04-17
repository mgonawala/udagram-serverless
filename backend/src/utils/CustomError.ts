export default class CustomError extends Error {

  constructor(public status: number = 500, ...params) {
    super(...params)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError)
    }

    this.status = status
  }
}
