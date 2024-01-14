import { type Tree } from '@nx/devkit';
import { joinPathFragments, updateJson } from '@nx/devkit';

import { type NormalizedSchema } from './normalize-options';

export function updateTsConfig(tree: Tree, options: NormalizedSchema): void {
  updateJson(
    tree,
    joinPathFragments(options.directory, 'tsconfig.json'),
    (json) => {
      json.references = [...json.references, { path: './tsconfig.dev.json' }];
      return json;
    }
  );

  updateJson(
    tree,
    joinPathFragments(options.directory, 'tsconfig.app.json'),
    (json) => {
      json = {
        extends: './tsconfig.dev.json',
        compilerOptions: { sourceMap: false }
      };
      return json;
    }
  );
}
