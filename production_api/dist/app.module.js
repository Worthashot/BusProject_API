"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const migration_module_1 = require("./migration/migration.module");
const auth_module_1 = require("./auth/auth.module");
const typeorm_1 = require("@nestjs/typeorm");
const apikey_entity_1 = require("./auth/entities/apikey.entity");
const log_old_entity_1 = require("./log/entities/log_old.entity");
const log_entity_1 = require("./log/entities/log.entity");
const config_1 = require("@nestjs/config");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot(),
            typeorm_1.TypeOrmModule.forRootAsync({
                name: "old_api",
                useFactory: () => ({
                    type: 'sqlite',
                    database: 'old_api.db',
                    entities: [apikey_entity_1.ApiKeyEntity],
                    synchronize: false,
                })
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                name: "old_log",
                useFactory: () => ({
                    type: 'sqlite',
                    database: 'old_log.db',
                    entities: [log_old_entity_1.LogEntityOld],
                    synchronize: false,
                })
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                name: "live",
                useFactory: () => ({
                    type: 'sqlite',
                    database: 'live.db',
                    entities: [apikey_entity_1.ApiKeyEntity, log_entity_1.LogEntity],
                    synchronize: false,
                })
            }),
            migration_module_1.MigrationModule,
            auth_module_1.AuthModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map