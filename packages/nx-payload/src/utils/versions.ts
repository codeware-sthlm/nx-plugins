export const payloadVersion = '^2.8.2';

export const payloadPluginsVersions: Record<string, string> = {
  '@payloadcms/bundler-webpack': '^1.0.6',
  '@payloadcms/db-mongodb': '^1.4.1',
  '@payloadcms/db-postgres': '^0.5.2',
  '@payloadcms/richtext-slate': '^1.3.1'
};

export const rimrafVersion = 'latest';

export const tsLibVersion = '^2.4.1';

// Required by Payload during tests
export const mongodbMemoryServerVersion = 'latest';
