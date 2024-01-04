const { SLACK_DEVOPS_WEBHOOK } = process.env;

/**
 * Semantic release options
 *
 * @see https://semantic-release.gitbook.io/semantic-release/usage/configuration#options
 *
 * @type {import('@types/semantic-release').Options}
 */
const coreOptions = {
  dryRun: false,
  ci: true,
  debug: false,

  // `PROJECT_NAME` provided by plugin
  tagFormat: '${PROJECT_NAME}-v${version}',
  preset: 'angular',

  // Cannot be read from package.json since object is not supported
  repositoryUrl: 'https://github.com/codeware-sthlm/nx-plugins',

  branches: [
    // Maintenance releases to existing releases
    // N.N.x or N.x.x or N.x
    '+([0-9])?(.{+([0-9]),x}).x',

    // Stable release to default branch
    'master',

    // Upcoming release
    'next'
  ],

  // Additional plugins
  plugins: [
    [
      'semantic-release-slack-bot',
      {
        notifyOnSuccess: true,
        notifyOnFail: true,
        slackWebhook: SLACK_DEVOPS_WEBHOOK
      }
    ]
  ]
};

/**
 * Plugin specific options
 *
 * @see https://github.com/TheUnderScorer/nx-semantic-release/tree/master?tab=readme-ov-file#available-options
 */
const pluginOptions = {
  // Project build target to auto-build when triggering a release
  buildTarget: '${PROJECT_NAME}:build',

  // Create changelog
  changelog: true,
  changelogFile: '${PROJECT_DIR}/CHANGELOG.md',

  // Create git commit and tag
  git: true,
  gitAssets: ['CHANGELOG.md', 'package.json'],
  commitMessage:
    // Add `[skip ci]` in message to prevent triggering a pipeline
    'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',

  // Create github release
  github: true,
  githubOptions: {},

  // Publish to npm
  npm: true,

  // Add link references to release notes
  linkCompare: true,
  linkReferences: true
};

module.exports = { ...coreOptions, ...pluginOptions };
