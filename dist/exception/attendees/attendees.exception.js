"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaximumLimitReached = void 0;
const common_1 = require("@nestjs/common");
class MaximumLimitReached extends common_1.HttpException {
    constructor(message) {
        // Use the provided message or fallback to the default message
        super(message || 'Event does not have enough capacity', common_1.HttpStatus.CONFLICT); // Use 409 for conflict
    }
}
exports.MaximumLimitReached = MaximumLimitReached;
//# sourceMappingURL=attendees.exception.js.map