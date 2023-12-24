import { BuildExecutorSchema } from './schema';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function runExecutor(options: BuildExecutorSchema) {
  console.log('No executor implemented');
  return {
    success: true,
  };
}
