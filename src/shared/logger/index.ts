import pino from 'pino';
import pinoPretty from 'pino-pretty';

export default pino(
  {
    enabled: process.env.LOGGER_ENABLED ? process.env.LOGGER_ENABLED === 'true' : false,
    level: process.env.LOGGER_LEVEL as string,
  },
  pinoPretty(),
);
