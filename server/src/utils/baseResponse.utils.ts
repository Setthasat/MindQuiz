export class BaseResponse {
    code: number;
    description: string;
    data: any;

    constructor(code: number = 200, description: string = "", data: any = null) {
        this.code = code;
        this.description = description;
        this.data = data;
    }

    buildResponse() {
        return {
            status: { code: this.code, description: this.description },
            data: this.data,
        };
    }

    setValue(code: number, description: string, data: any) {
        this.code = code;
        this.description = description;
        this.data = data;
    }
}