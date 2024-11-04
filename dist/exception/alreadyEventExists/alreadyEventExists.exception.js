"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlreadyEventExistsException = void 0;
const common_1 = require("@nestjs/common");
class AlreadyEventExistsException extends common_1.HttpException {
    constructor(message) {
        // Use the provided message or fallback to the default message
        super(message || 'Event  Already Exists', common_1.HttpStatus.CONFLICT); // Use 409 for conflict
    }
}
exports.AlreadyEventExistsException = AlreadyEventExistsException;
//# sourceMappingURL=alreadyEventExists.exception.js.map