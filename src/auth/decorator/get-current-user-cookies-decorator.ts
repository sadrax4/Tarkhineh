import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const GetCurrentUserCookies = createParamDecorator(
    (data: any, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();
        return request.cookies[data];
    })