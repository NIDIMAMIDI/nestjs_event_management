"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./modules/app/app.module");
const helmet_1 = require("helmet");
const express = require("express");
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    // Create a NestJS application instance using the AppModule.
    // The 'cors: true' option enables Cross-Origin Resource Sharing for the application.
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { cors: true });
    // Use the Helmet middleware to enhance API security by setting various HTTP headers.
    app.use((0, helmet_1.default)());
    app.use(express.json());
    // Use a global validation pipe to automatically validate incoming request data based on DTOs.
    // - `whitelist: true` strips properties not defined in the DTO.
    // - `transform: true` automatically transforms payloads to be objects typed according to their DTO classes.
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true, // Strip properties that are not defined in the DTO
        forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are present
        transform: true, // Automatically transform payloads to be objects typed according to their DTO classes
    }));
    // Get the ConfigService to access environment variables.
    const configService = app.get(config_1.ConfigService);
    // Retrieve the PORT environment variable or use 5555 as a fallback if not defined.
    const port = configService.get('PORT') || 5555;
    // Set the global prefix to 'api'
    app.setGlobalPrefix('api');
    // Start the NestJS application and listen on the specified port.
    await app.listen(port, () => {
        console.log(`App has been started at port ${port}`);
    });
}
// Call the bootstrap function to initialize and run the application.
bootstrap();
//# sourceMappingURL=main.js.map