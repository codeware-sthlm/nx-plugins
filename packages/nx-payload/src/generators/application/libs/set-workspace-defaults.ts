import { type Tree, readNxJson, updateNxJson } from '@nx/devkit';

import { type NormalizedSchema } from './normalize-options';

export function setWorkspaceDefaults(host: Tree, options: NormalizedSchema) {
  const workspace = readNxJson(host);
  if (!workspace) {
    throw new Error('Could not read nx.json');
  }

  if (!workspace.defaultProject) {
    workspace.defaultProject = options.name;
  }

  workspace.generators = workspace.generators || {};
  workspace.generators['@cdwr/nx-payload'] =
    workspace.generators['@cdwr/nx-payload'] || {};
  const prev = workspace.generators['@cdwr/nx-payload'];

  workspace.generators = {
    ...workspace.generators,
    '@cdwr/nx-payload': {
      ...prev,
      application: {
        linter: options.linter,
        ...prev.application
      }
    }
  };
  updateNxJson(host, workspace);
}
