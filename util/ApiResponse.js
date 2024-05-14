class ApiResponse{
    constructor(statusCode, data, message="success", success=true){
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = success;
    }
}
module.exports = ApiResponse;