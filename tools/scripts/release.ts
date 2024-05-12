import chalk from 'chalk';
import { releaseChangelog, releasePublish, releaseVersion } from 'nx/release';
import type { NxReleaseChangelogResult } from 'nx/src/command-line/release/changelog';
import type { VersionData } from 'nx/src/command-line/release/version';
import { cancel, confirm, group, intro, outro, select } from '@clack/prompts';

(async () => {
  intro(`Let's release some Nx Plugin packages`);

  const release = await group(
    {
      dryRun: () =>
        select({
          message:
            'Do you want to see a preview before making the actual release?',
          options: [
            {
              value: 'true',
              label: `Yes, just a preview 🤓`,
              hint: 'recommended before the actual release'
            },
            {
              value: 'false',
              label: 'No, try to make the actual release 🚀'
            }
          ],
          initialValue: 'true'
        }),
      publish: ({ results: { dryRun } }) => {
        // If the user selected dryRun, skip the publish prompt
        if (dryRun === 'true') {
          return;
        }
        return select({
          message: 'Do you want GitHub Actions to publish the packages to NPM?',
          options: [
            {
              value: 'true',
              label: 'Yes, let GitHub Actions do it',
              hint: 'recommended'
            },
            {
              value: 'false',
              label: 'No, publish the packages directly'
            }
          ],
          initialValue: 'true'
        });
      },
      verbose: () =>
        confirm({
          message: 'Do you want to enable verbose logging?',
          active: 'Verbose logging',
          inactive: 'Normal logging',
          initialValue: false
        }),
      confirmRelease: ({ results: { dryRun } }) => {
        // If the user selected dryRun, skip the confirmation prompt
        if (dryRun === 'true') {
          return;
        }
        return confirm({
          message: `✋ You will run the actual release process! Are you sure?`,
          active: 'Yes, do it!',
          inactive: `No, I'm not ready yet`
        });
      }
    },
    {
      // On Cancel callback that wraps the group
      // So if the user cancels one of the prompts in the group this function will be called
      onCancel: () => {
        cancel('Release cancelled.');
        process.exit(0);
      }
    }
  );

  const { confirmRelease, verbose } = release;
  const dryRun = release.dryRun === 'true';
  const publish = release.publish === 'true';

  if (!dryRun && !confirmRelease) {
    cancel('Release cancelled.');
    process.exit(0);
  }

  let projectsVersionData: VersionData;
  let projectChangelogs: NxReleaseChangelogResult | undefined;
  let publishStatus: number;

  // Analyze changes
  console.log(`\n${chalk.magenta.underline('Analyze changes')}`);
  const versionStatus = await releaseVersion({
    dryRun,
    verbose
  });
  projectsVersionData = versionStatus.projectsVersionData;

  // Generate changelogs
  console.log(`${chalk.magenta.underline('Generate changelogs')}`);
  try {
    const changelogStatus = await releaseChangelog({
      versionData: projectsVersionData,
      dryRun,
      verbose
    });
    projectChangelogs = changelogStatus.projectChangelogs;
  } catch (error) {
    console.error(`Generate changelogs: ${(error as Error).message}`);
    process.exit(1);
  }

  // Check if there are any changes to publish
  const newVersionFound = Object.keys(projectsVersionData).some(
    (project) => projectsVersionData[project].newVersion
  );

  if (newVersionFound && !publish && !dryRun) {
    outro('The new release will be published by GitHub Actions');
    process.exit(0);
  }

  // Skip publish if there are no changes
  if (!newVersionFound) {
    process.exit(0);
  }

  // Skip publish with message if the user selected dryRun and not to publish
  if (dryRun && !publish) {
    outro(
      `${chalk.green('Done!')} Nothing gets changed when running in ${chalk.bgYellow(' preview ')} mode`
    );
    process.exit(0);
  }

  // Skip publish
  if (!publish) {
    process.exit(0);
  }

  // The returned number value from releasePublish will be zero if all projects are published successfully, non-zero if not
  console.log(`${chalk.magenta.underline('Publish packages')}\n`);
  try {
    publishStatus = await releasePublish({
      dryRun,
      verbose
    });
  } catch (error) {
    console.error(`Publish packages: ${(error as Error).message}`);
    process.exit(1);
  }

  if (dryRun) {
    outro(
      `${chalk.green('Done!')} Nothing gets changed when running in ${chalk.bgYellow(' preview ')} mode`
    );
  } else {
    outro(
      publishStatus === 0
        ? chalk.green('Released successfully!')
        : chalk.red('Release failed')
    );
  }

  process.exit(publishStatus);
})();
