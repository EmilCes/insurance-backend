// any-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';

@Catch()
export class AnyExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    console.error('Se lanzó una excepción:', exception);

    // Reenvía la excepción para que Nest maneje la respuesta
    throw exception;
  }
}