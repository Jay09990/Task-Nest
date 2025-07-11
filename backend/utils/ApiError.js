class ApiError extends Error {
    constructor(
        ststusCode,
        message = "something went wrong",
        error = [],
        stack = ""
    ) {
        super(message)
        this.ststusCode = ststusCode
        this.data = null
        this.message = message
        this.success = false;
        this.errors = error

        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export { ApiError }