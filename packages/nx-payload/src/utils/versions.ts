/**
 * Supported Payload version, i.e a major version
 */
export const payloadVersion = '^2.8.2';

/**
 * Payload plugins supported by the plugin
 * @link https://github.com/payloadcms/payload/tree/main/packages
 */
export const payloadPluginsVersions: Record<string, string> = {
  '@payloadcms/bundler-webpack': '^1.0.6',
  '@payloadcms/db-mongodb': '^1.4.1',
  '@payloadcms/db-postgres': '^0.5.2',
  '@payloadcms/richtext-slate': '^1.3.1'
};

/**
 * Payload peer dependencies must be plugin dependencies
 * @link https://github.com/payloadcms/payload/blob/main/package.json
 */
export const payloadPeerVersions: Record<string, string> = {
  react: '18.2.0',
  'react-i18next': '11.18.6',
  'react-router-dom': '5.3.4'
};

export const rimrafVersion = 'latest';

export const tsLibVersion = '^2.4.1';

// Required by Payload during tests
export const mongodbMemoryServerVersion = 'latest';
export const reactDomVersion = '18.2.0';
