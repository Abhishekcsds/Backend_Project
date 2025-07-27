// ✅ Custom API Error class that extends the built-in Error class
class ApiError extends Error {

    // Constructor accepts statusCode, message, array of errors, and a custom stack
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ) {
        super(message); // Call the parent Error constructor to set message

        // ✅ Custom properties added to our error object
        this.statusCode = statusCode;  // e.g., 400, 404, 500
        this.data = null;              // placeholder if needed for failed data
        this.message = message;        // error message string
        this.errors = errors;          // optional: list of validation or nested errors
        this.success = false;          // standard flag to indicate failure

        // ✅ Stack trace: use provided one or auto-generate from current call
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError };
