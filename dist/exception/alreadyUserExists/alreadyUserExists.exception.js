"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlreadyUserExistsException = void 0;
const common_1 = require("@nestjs/common");
class AlreadyUserExistsException extends common_1.HttpException {
    constructor(message) {
        // Use the provided message or fallback to the default message
        super(message || 'User Already Exists', common_1.HttpStatus.CONFLICT); // Use 409 for conflict
    }
}
exports.AlreadyUserExistsException = AlreadyUserExistsException;
//# sourceMappingURL=alreadyUserExists.exception.js.map