"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordMismatchException = void 0;
const common_1 = require("@nestjs/common");
class PasswordMismatchException extends common_1.HttpException {
    constructor() {
        super('Password and Confirm Password must match. Please provide them as same.', common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.PasswordMismatchException = PasswordMismatchException;
//# sourceMappingURL=passwordMismatch.exception.js.map