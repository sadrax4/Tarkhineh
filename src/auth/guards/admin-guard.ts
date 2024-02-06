import { AuthGuard } from "@nestjs/passport";

export class AdminGuard extends AuthGuard('admin') { }
