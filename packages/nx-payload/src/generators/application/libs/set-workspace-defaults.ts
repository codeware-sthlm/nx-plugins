import {
  Tree,
  readWorkspaceConfiguration,
  updateWorkspaceConfiguration,
} from '@nrwl/devkit';

import { NormalizedSchema } from './normalize-options';

export function setWorkspaceDefaults(host: Tree, options: NormalizedSchema) {
  const workspace = readWorkspaceConfiguration(host);

  if (!workspace.defaultProject) {
    workspace.defaultProject = options.projectName;
  }

  workspace.generators = workspace.generators || {};
  workspace.generators['@cws-tools/nx-payload'] =
    workspace.generators['@cws-tools/nx-payload'] || {};
  const prev = workspace.generators['@cws-tools/nx-payload'];

  workspace.generators = {
    ...workspace.generators,
    '@cws-tools/nx-payload': {
      ...prev,
      application: {
        linter: options.linter,
        ...prev.application,
      },
    },
  };
  updateWorkspaceConfiguration(host, workspace);
}
