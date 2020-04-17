export function getStatusCode(e, code) {
    if (e instanceof CustomError)
        return e.status;
    else
        return code;
}
//# sourceMappingURL=AWS.js.map