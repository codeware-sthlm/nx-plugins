import type { Tree } from '@nrwl/devkit';
import { joinPathFragments, updateJson } from '@nrwl/devkit';

import { NormalizedSchema } from './normalize-options';

export function updateTsConfig(tree: Tree, options: NormalizedSchema): void {
  updateJson(
    tree,
    joinPathFragments(options.projectRoot, 'tsconfig.json'),
    (json) => {
      json.references = [...json.references, { path: './tsconfig.dev.json' }];
      return json;
    }
  );

  updateJson(
    tree,
    joinPathFragments(options.projectRoot, 'tsconfig.app.json'),
    (json) => {
      json = {
        extends: './tsconfig.dev.json',
        compilerOptions: { sourceMap: false },
      };
      return json;
    }
  );
}
