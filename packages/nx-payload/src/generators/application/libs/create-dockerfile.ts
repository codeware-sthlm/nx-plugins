import { type Tree, getPackageManagerCommand, readNxJson } from '@nx/devkit';

import type { NormalizedSchema } from './normalize-options';

/**
 * Create application Dockerfile. Use commands depending on current package manager.
 */
export function createDockerfile(host: Tree, options: NormalizedSchema): void {
  const { directory, name } = options;

  const skipNxCloud = readNxJson(host)?.nxCloudAccessToken === undefined;

  const pmCommand = getPackageManagerCommand();

  const content = `
  # Payload app
  FROM node:18 as build

  ARG MONGO_URL
  ARG NODE_ENV
  ARG PAYLOAD_PUBLIC_SERVER_URL
  ARG PORT

  ENV MONGO_URL=\${MONGO_URL}
  ENV NODE_ENV=\${NODE_ENV}
  ENV PAYLOAD_PUBLIC_SERVER_URL=\${PAYLOAD_PUBLIC_SERVER_URL}
  ENV PORT=\${PORT}

  WORKDIR /app

  COPY package.json ./
  RUN ${pmCommand.install}

  COPY . .

  # Admin bundle need the configuration when building a static app
  # https://payloadcms.com/docs/configuration/overview
  RUN PAYLOAD_CONFIG_PATH=${directory}/src/payload.config.ts ${
    pmCommand.exec
  } nx build ${name} ${skipNxCloud ? '--no-cloud' : ''}

  # Final image
  FROM node:18-alpine3.18
  WORKDIR /app

  # We'll create a structure similar to scaffolding a default payload workspace
  COPY --from=build /app/build ./build
  COPY --from=build /app/dist/${directory}/src ./dist
  COPY --from=build /app/dist/${directory}/package.json ./

  # 1. Create symlink to root which will make Payload find it natively
  #    without setting PAYLOAD_CONFIG_PATH.
  # 2. Node server needs production dependencies to run.
  RUN ln -s ./dist/payload.config.js . && \
  ${pmCommand.install} --prod

  EXPOSE 3000

  CMD ["node", "dist/main.js"]
  `;

  host.write(`${directory}/Dockerfile`, content);
}
