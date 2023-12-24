import { Schema as ExpressSchema } from '@nx/express/src/generators/application/schema';

export type Schema = Required<Pick<ExpressSchema, 'directory' | 'name'>> &
  Partial<
    Pick<
      ExpressSchema,
      'linter' | 'projectNameAndRootFormat' | 'unitTestRunner' | 'tags'
    >
  > & { skipE2e?: boolean };
