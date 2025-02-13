import { TestRunnerConfig } from '@storybook/test-runner';

// eslint-disable-next-line @nx/enforce-module-boundaries
import { getTestRunnerConfig } from '../../shared-storybook-utils/.storybook/storybook-testrunner';

const config: TestRunnerConfig = getTestRunnerConfig('dist/test-storybook/packages/design-system/storybook-host-app');

export default config;
