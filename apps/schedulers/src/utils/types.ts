import { RedisOptions } from 'bullmq';

export type RedisConnectionOptions = Pick<
  RedisOptions,
  'host' | 'port' | 'username' | 'password'
>;
