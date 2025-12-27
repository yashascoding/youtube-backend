class ApiResponse
{
    constructor(Statuscode,data,message="Success")
    {
        this.Statuscode=Statuscode
        this.data=data
        this.message=message
        this.success=Statuscode ,400   
}
}