import { AppGeneratorSchema } from '../application/schema';

export type PresetGeneratorSchema = {
  /**
   * Since `name` contains workspace name,
   * we need a separate one for the application
   */
  appName?: string;
  appDirectory?: string;
} & Partial<
  // `name` is provided from `create-nx-payload`, when used, and contains workspace name
  Pick<AppGeneratorSchema, 'name' | 'skipE2e' | 'tags' | 'unitTestRunner'>
>;
