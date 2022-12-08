import type { Tree } from '@nrwl/devkit';

export function updateGitignore(host: Tree): void {
  let ignoreFile = host.read('.gitignore').toString();

  if (ignoreFile.indexOf('# Payload files') === -1) {
    ignoreFile = `${ignoreFile}
# Payload files
build
  `;
  }
  host.write('.gitignore', ignoreFile);
}
