import { exec, execSync } from 'child_process';

export const startLocalRegistry = async () => {
  execSync(
    'docker build --quiet -f .verdaccio/Dockerfile -t verdaccio:local .',
    { encoding: 'utf-8', stdio: 'inherit' }
  );

  execSync(
    'docker build --quiet -f .verdaccio/Dockerfile -t verdaccio:local .',
    { encoding: 'utf-8', stdio: 'inherit' }
  );
};
