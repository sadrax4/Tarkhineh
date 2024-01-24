import { BadRequestException, ValidationPipe } from "@nestjs/common";

export const ErrorValidation = () => {
    return new ValidationPipe({
        exceptionFactory: (errors) => {
            const result = errors.map((error) => (
                error.constraints[Object.keys(error.constraints)[0]]
            ))
            return new BadRequestException(result[0]);
        }
    })
}