"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseResponse = void 0;
class BaseResponse {
    constructor(code = 200, description = "", data = null) {
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
    setValue(code, description, data) {
        this.code = code;
        this.description = description;
        this.data = data;
    }
}
exports.BaseResponse = BaseResponse;
