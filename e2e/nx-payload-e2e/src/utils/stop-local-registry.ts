/**
 * This script stops the local registry for testing purposes.
 *
 * For e2e it is meant to be called in jest's `globalTeardown`.
 */

export default () => {
  if (!global.stopLocalRegistry) {
    console.log('Local registry is not started');
    return;
  }

  global.stopLocalRegistry();
  console.log('Killed local registry process');
};
