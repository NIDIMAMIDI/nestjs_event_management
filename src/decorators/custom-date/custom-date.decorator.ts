/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-wrapper-object-types */
import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsFutureDate(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isFutureDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          // Check if the value is a valid date
          const date = new Date(value);
          return !isNaN(date.getTime()) && date > new Date(); // Ensure date is in the future
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid date in the future.`;
        },
      },
    });
  };
}
