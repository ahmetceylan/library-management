import { Request, Response, NextFunction } from 'express';
import * as winston from 'winston';
/**
 * Middleware to log all incoming requests and their payloads
 */
export const requestLoggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const requestBody = { ...req.body };

  // Log request details
  winston.log(`REQUEST: ${req.method} ${req.originalUrl}`, {
    method: req.method,
    url: req.originalUrl,
    query: req.query,
    params: req.params,
    body: requestBody,
    headers: {
      'user-agent': req.headers['user-agent'],
      'content-type': req.headers['content-type']
    },
    ip: req.ip
  });

  // Capture and log response
  const originalSend = res.send;
  res.send = function (body) {
    winston.log(`RESPONSE: ${req.method} ${req.originalUrl} - Status: ${res.statusCode}`, {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode
    });

    return originalSend.call(this, body);
  };

  next();
};
