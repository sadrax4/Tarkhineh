import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const GetCurrentUser = createParamDecorator(
    (data: any, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();
        if (request?.user !== undefined && request?.user !== null) {
            return request?.user[data];
        }
    }
)