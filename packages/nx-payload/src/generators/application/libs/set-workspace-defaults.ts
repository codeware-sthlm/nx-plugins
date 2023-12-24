import { type Tree, readNxJson, updateNxJson } from '@nx/devkit';

import type { NormalizedSchema } from './normalize-options';

export function setWorkspaceDefaults(host: Tree, options: NormalizedSchema) {
  const workspace = readNxJson(host);

  if (!workspace.defaultProject) {
    workspace.defaultProject = options.name;
  }

  workspace.generators = workspace.generators || {};
  workspace.generators['@codeware-sthlm/nx-payload'] =
    workspace.generators['@codeware-sthlm/nx-payload'] || {};
  const prev = workspace.generators['@codeware-sthlm/nx-payload'];

  workspace.generators = {
    ...workspace.generators,
    '@codeware-sthlm/nx-payload': {
      ...prev,
      application: {
        linter: options.linter,
        ...prev.application,
      },
    },
  };
  updateNxJson(host, workspace);
}
