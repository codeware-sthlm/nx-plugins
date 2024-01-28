import { type Tree, getPackageManagerCommand, readNxJson } from '@nx/devkit';

import { type NormalizedSchema } from './normalize-options';

/**
 * Create application Dockerfile. Use commands depending on current package manager.
 */
export function createDockerfile(host: Tree, options: NormalizedSchema): void {
  const { directory, name } = options;

  const skipNxCloud = readNxJson(host)?.nxCloudAccessToken === undefined;

  const pmCommand = getPackageManagerCommand();

  const content = `
FROM node:20-alpine as base

FROM base as builder

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

RUN ${pmCommand.exec} nx build ${name} ${skipNxCloud ? '--no-cloud' : ''}

# We'll create a structure similar to scaffolding a default payload workspace.
# Admin build output should match \`buildPath\` in payload.config.ts.
FROM base as runtime

ENV NODE_ENV production

WORKDIR /app

COPY --from=builder /app/dist/${directory}/package.json ./
RUN ${pmCommand.install}

COPY --from=builder /app/dist/${directory}/src   ./dist
COPY --from=builder /app/dist/${directory}/build ./dist/${directory}/build

EXPOSE 3000

CMD ["node", "dist/main.js"]
`;

  host.write(`${directory}/Dockerfile`, content);
}
