import logger from './logger-config';

export function logConsole<T>(message: string, args?: T): void {
  logger.log({ level: 'info', message, args });
}
