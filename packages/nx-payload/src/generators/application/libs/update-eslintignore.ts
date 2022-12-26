import type { Tree } from '@nrwl/devkit';

export function updateEslintignore(host: Tree): void {
  let ignoreContent = host.read('.eslintignore')?.toString() ?? '';

  if (ignoreContent.indexOf('# Payload files') === -1) {
    ignoreContent = `${ignoreContent}
# Payload files
/apps/**/payload-types.ts
  `;
  }
  host.write('.eslintignore', ignoreContent);
}
