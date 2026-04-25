export class ApiResponse{
    private statusCode;
    private data;
    public message;
    public success;
    constructor(statusCode:string, data:any, message="success", success=true){
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = success;
    }
}