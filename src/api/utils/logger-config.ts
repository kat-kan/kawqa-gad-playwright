import * as winston from 'winston';
const { format, createLogger, transports, addColors } = winston;
const { printf, combine, colorize, timestamp, label, errors } = format;

const logFormat = printf(({ level, label, message, timestamp }) => {
  return `${timestamp} ${label} ${level}: ${message}`;
});

let loggerFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  label({ label: '[LOGGER]' }),
  errors({ stack: true }),
  logFormat,
);

addColors({
  info: 'bold blue',
  warn: 'italic yellow',
  error: 'bold red',
  debug: 'green',
});

const logger = createLogger({
  level: "info",
  transports: [
    new transports.Console({
      format: combine(colorize(), loggerFormat)
    })
  ],
});

export default logger;
