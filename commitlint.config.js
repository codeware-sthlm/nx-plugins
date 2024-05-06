const { execSync } = require('child_process');

const projects = JSON.parse(
  execSync('nx show projects --type lib --projects "*nx*" | jq -R | jq -cs', {
    encoding: 'utf-8'
  })
);
// Allow release commits
projects.push('release');

module.exports = {
  extends: ['@commitlint/config-angular'],
  rules: {
    'scope-enum': [2, 'always', projects],
    'type-enum': [
      2,
      'always',
      [
        'build',
        'chore',
        'ci',
        'docs',
        'feat',
        'fix',
        'perf',
        'refactor',
        'revert',
        'test',
        'release'
      ]
    ]
  }
};
