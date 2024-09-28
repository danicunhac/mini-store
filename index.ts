import 'dotenv/config';
import chalk from 'chalk';

import { app } from 'server';

let loadingInterval: NodeJS.Timeout | null = null;

export const startLoading = (message: string) => {
  const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  let i = 0;
  process.stdout.write('\r');
  loadingInterval = setInterval(() => {
    process.stdout.write(`\r${chalk.magentaBright(frames[i])} ${message}`);
    i = (i + 1) % frames.length;
  }, 80);
};

export const stopLoading = () => {
  if (loadingInterval) {
    clearInterval(loadingInterval);
    loadingInterval = null;
    process.stdout.write('\r\n');
  }
};

const start = async () => {
  try {
    await app.listen({ port: 3000 });
    startLoading('Server running on :3000..');
  } catch (err) {
    stopLoading();
    app.log.error(err);
    process.exit(1);
  }
};

start();
