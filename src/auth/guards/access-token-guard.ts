import { AuthGuard } from "@nestjs/passport";

export class AdminGuard extends AuthGuard('jwt') { }
