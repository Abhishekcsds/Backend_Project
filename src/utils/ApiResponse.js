class ApiResponse {
    constructor(statusCode, data, message = "success") {
        // HTTP status code, like 200, 201, 404, etc.
        this.statusCode = statusCode;

        // Actual data you want to send in response (user, post, list, etc.)
        this.data = data;

        // Optional message, default is "success"
        this.message = message;

        // Auto-set success flag: true for status codes < 400, else false
        this.success = statusCode < 400;
    }
}

export { ApiResponse };
