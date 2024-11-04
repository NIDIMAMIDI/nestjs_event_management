import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import helmet from 'helmet';
import * as express from 'express';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // Create a NestJS application instance using the AppModule.
  // The 'cors: true' option enables Cross-Origin Resource Sharing for the application.
  const app = await NestFactory.create(AppModule, { cors: true });

  // Use the Helmet middleware to enhance API security by setting various HTTP headers.
  app.use(helmet());

  app.use(express.json());

  // Use a global validation pipe to automatically validate incoming request data based on DTOs.
  // - `whitelist: true` strips properties not defined in the DTO.
  // - `transform: true` automatically transforms payloads to be objects typed according to their DTO classes.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that are not defined in the DTO
      forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are present
      transform: true, // Automatically transform payloads to be objects typed according to their DTO classes
    }),
  );

  // Get the ConfigService to access environment variables.
  const configService = app.get(ConfigService);

  // Retrieve the PORT environment variable or use 5555 as a fallback if not defined.
  const port = configService.get<number>('PORT') || 5555;

  // Set the global prefix to 'api'
  app.setGlobalPrefix('api');

  // Start the NestJS application and listen on the specified port.
  await app.listen(port, () => {
    console.log(`App has been started at port ${port}`);
  });
}

// Call the bootstrap function to initialize and run the application.
bootstrap();
