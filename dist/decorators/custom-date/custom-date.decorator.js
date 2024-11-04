"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsFutureDate = IsFutureDate;
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-wrapper-object-types */
const class_validator_1 = require("class-validator");
function IsFutureDate(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isFutureDate',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value, args) {
                    // Check if the value is a valid date
                    const date = new Date(value);
                    return !isNaN(date.getTime()) && date > new Date(); // Ensure date is in the future
                },
                defaultMessage(args) {
                    return `${args.property} must be a valid date in the future.`;
                },
            },
        });
    };
}
//# sourceMappingURL=custom-date.decorator.js.map