import 'dotenv/config';
import chalk from 'chalk';

import { app } from './src/server';

const start = async () => {
  try {
    await app.listen({ port: 3000 });
    console.log(
      `${chalk.green('Server running on port')} ${chalk.magenta('3000')}`
    );
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
