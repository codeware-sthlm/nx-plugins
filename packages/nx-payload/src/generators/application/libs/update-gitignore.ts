import type { Tree } from '@nx/devkit';

export function updateGitignore(host: Tree): void {
  let ignoreContent = host.read('.gitignore')?.toString() ?? '';

  if (ignoreContent.indexOf('# Payload files') === -1) {
    ignoreContent = `${ignoreContent}
# Payload files
build
  `;
  }
  host.write('.gitignore', ignoreContent);
}
