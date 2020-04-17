export default class CustomError extends Error {
    constructor(status = 500, ...params) {
        super(...params);
        this.status = status;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, CustomError);
        }
        this.status = status;
    }
}
//# sourceMappingURL=CustomError.js.map