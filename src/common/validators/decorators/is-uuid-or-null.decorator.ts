import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { isUUID } from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsUUIDOrNullConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    return value === null || isUUID(value);
  }

  defaultMessage() {
    return 'Value must be a valid UUID or null';
  }
}

export function IsUUIDorNull(validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUUIDOrNullConstraint,
    });
  };
}
