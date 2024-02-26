import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { SwaggerDocument } from "./swagger.enum";

export function SwaggerInit(
    app: INestApplication
): void {
    const config = new DocumentBuilder()
        .setTitle(SwaggerDocument.TITLE)
        .setDescription(SwaggerDocument.DESCRIPTION)
        .setVersion(SwaggerDocument.VERSION)
        .setContact("sadra soleimani", "09162844007", "sadranodejs@gmail.com")
        .addTag(SwaggerDocument.TAG1)
        .addTag(SwaggerDocument.TAG2)
        .addTag(SwaggerDocument.TAG3)
        .addTag(SwaggerDocument.TAG4)
        .addTag(SwaggerDocument.TAG5)
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(SwaggerDocument.PATH, app, document);
}
