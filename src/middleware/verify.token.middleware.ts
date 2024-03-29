import { Injectable, CanActivate, ExecutionContext, HttpStatus } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as config from 'config';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;

    if (!token) {
      this.sendErrorResponse(HttpStatus.UNAUTHORIZED, 'No token provided');
      return false; // No token provided
    }

    try {
      const decodedToken: any = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);

      // Check if the token has expired
      if (decodedToken.exp && decodedToken.exp < Math.floor(Date.now() / 1000)) {
        this.sendErrorResponse(HttpStatus.UNAUTHORIZED, 'Token has expired');
        return false; // Token has expired
      }

      // Attach the user ID to the request object for later use
      request.userId = decodedToken.userId;
      return true; // Token is valid
    } catch (error) {
      this.sendErrorResponse(HttpStatus.UNAUTHORIZED, 'Invalid token');
      return false; // Invalid token
    }
  }

  private sendErrorResponse(status: HttpStatus, message: string) {
    throw { statusCode: status, message: message };
  }
}
