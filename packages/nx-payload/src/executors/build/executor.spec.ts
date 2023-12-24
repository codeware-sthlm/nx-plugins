import executor from './executor';
import { BuildExecutorSchema } from './schema';

const options: BuildExecutorSchema = {};

describe('Build Executor', () => {
  console.log = jest.fn();

  it('should run', async () => {
    const output = await executor(options);
    expect(output.success).toBe(true);
  });
});
