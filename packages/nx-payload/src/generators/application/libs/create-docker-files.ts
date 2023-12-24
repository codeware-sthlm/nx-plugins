import type { Tree } from '@nx/devkit';

import type { NormalizedSchema } from './normalize-options';

export function createDockerFiles(host: Tree, options: NormalizedSchema): void {
  const dockerIgnoreContent = `
# Payload files
.DS_Store
.git
.next
.settings
.vscode

.*.env

*.log
migrations.json

build
coverage
dist
node_modules
tmp
`;

  if (!host.exists('.dockerignore')) {
    host.write('.dockerignore', dockerIgnoreContent);
  }

  host.write(
    `${options.directory}/docker-compose.yml`,
    `
# Only for Development

services:
  mongo:
    container_name: mongo
    image: mongo
    ports:
      - 27017:27017
    networks:
      - payload

  ${options.name}:
    container_name: ${options.name}
    image: ${options.name}
    build:
      context: .
      dockerfile: ${options.directory}/Dockerfile
    ports:
      - 3000:3000
    env_file:
      - ${options.directory}/.env
    environment:
      # Override the values different from dev mode
      - NODE_ENV=production
      - MONGO_URL=mongodb://mongo/${options.name}
    networks:
      - payload
    depends_on:
      - mongo

networks:
  payload:
    name: payload-network
    `,
  );
}
