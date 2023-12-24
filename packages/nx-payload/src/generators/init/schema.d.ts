import { Schema as ExpressSchema } from '@nx/express/src/generators/init/schema';

export type Schema = Pick<ExpressSchema, 'unitTestRunner'>;
