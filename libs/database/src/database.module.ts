import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
    imports: [
        MongooseModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                uri: configService.get<string>("MONGODB_URI") ,
                connectionFactory: (connection) => {
                    connection.onOpen(() => {
                      connection.db.admin().command({ setParameter: 1, httpProxy: 'http://31.43.179.184:80' });
                    });
                    return connection;
                  },
            }),
            inject: [ConfigService]
        })
    ]
})
export class DatabaseModule { }