import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { RequestHandler } from 'express';
import { HttpException } from '@exceptions/HttpException';
import { SocketWithUserData } from '@/interfaces/sockets.interface';

const socketValidationMiddleware = (
  socket: SocketWithUserData,
  type: any,
  value: unknown,
  skipMissingProperties = false,
  whitelist = true,
  forbidNonWhitelisted = true,
) =>
  validate(plainToInstance(type, value), { skipMissingProperties, whitelist, forbidNonWhitelisted }).then((errors: ValidationError[]) => {
    if (errors.length > 0) {
      const message = errors
        .map((error: ValidationError) =>
          error.constraints ? Object.values(error.constraints) : error.children.map((error: ValidationError) => Object.values(error.constraints)),
        )
        .join(', ');
      const error = new HttpException(400, message);

      return socket.emit('error', { error });
    } else {
      return false;
    }
  });

export default socketValidationMiddleware;
