import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { SwaggerDocument } from "./swagger.enum";
import { url } from "inspector";

export function SwaggerInit(app: INestApplication): void {
    const config = new DocumentBuilder()
        .setTitle(SwaggerDocument.TITLE)
        .setDescription(SwaggerDocument.DESCRIPTION)
        .setVersion(SwaggerDocument.VERSION)
        .setContact("sadra soleimani", "09162844007", "sadranodejs@gmail.com")
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(SwaggerDocument.PATH, app, document);
}