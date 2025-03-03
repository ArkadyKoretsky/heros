import { Logger } from '@nestjs/common';
import { readFileSync } from 'fs';
import { load } from 'js-yaml';
import { join } from 'path';

export default (): Record<string, any> => {
  const logger = new Logger('configuration');
  const path = join(__dirname, 'config.yaml');
  try {
    const configuration = load(readFileSync(path, 'utf8')) as Record<
      string,
      any
    >;
    logger.log(
      `Successfully loaded YAML configuration from ${path}`,
      configuration,
    );
    return configuration;
  } catch (error) {
    logger.error(`Error reading YAML configuration file at ${path}`, error);
    return {};
  }
};
