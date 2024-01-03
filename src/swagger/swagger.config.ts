import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { SwaggerDocument } from "./swagger.enum";

export function SwaggerInit(app: INestApplication): void {
    const config = new DocumentBuilder()
        .setTitle(SwaggerDocument.TITLE)
        .setDescription(SwaggerDocument.DESCRIPTION)
        .setVersion(SwaggerDocument.VERSION)
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(SwaggerDocument.PATH, app, document);
}