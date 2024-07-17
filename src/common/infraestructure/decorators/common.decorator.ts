import { Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiResponseSchemaHost, getSchemaPath } from '@nestjs/swagger';
import { ValidationArguments, ValidationOptions, registerDecorator } from 'class-validator';

import { IDApiResponseCase } from 'src/common/domain/entities/common.entity';

import { apiResponseDto } from '../dtos/common.dto';

export function IsUnderscoreSeparatedLetters(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsUnderscoreSeparatedLetters',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: string) {
          return typeof value === 'string' && /^([a-zA-Z]+_)*[a-zA-Z]+$/.test(value);
        },
        defaultMessage() {
          return 'The text ($value) is not underscore separated letters only';
        },
      },
    });
  };
}

export const DApiResponseCase = <DataDto extends Type<unknown>>({
  statusCode,
  description,
  schema,
  dataDto,
}: IDApiResponseCase<DataDto, Pick<ApiResponseSchemaHost, 'schema'>['schema']>) => {
  if (dataDto === undefined) {
    return applyDecorators(
      ApiExtraModels(apiResponseDto),
      ApiResponse({
        status: statusCode,
        description: description,
        schema: schema,
      }),
    );
  }
  return applyDecorators(
    ApiExtraModels(apiResponseDto, dataDto),
    ApiResponse({
      status: statusCode,
      description: description,
      schema: {
        ...schema,
        allOf: [
          { $ref: getSchemaPath(apiResponseDto) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(dataDto) },
              },
            },
          },
        ],
      },
    }),
  );
};

export const IsGreaterThanMaxLength = (validationOptions?: ValidationOptions) => {
  const maxLength = 2147483647; // Max length for int row in postgres

  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsGreaterThanMaxLength',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: number) {
          if (typeof value !== 'number') {
            return false;
          }
          return value <= maxLength;
        },
        defaultMessage() {
          return `The ${propertyName} must be less than ${maxLength} characters`;
        },
      },
    });
  };
};

export function IsLengthLessThan(limit: number, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isLengthLessThan',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [limit],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const str = value?.toString();
          return str?.length <= relatedPropertyName;
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return `${args.property} must have less than ${relatedPropertyName} digits`;
        },
      },
    });
  };
}
