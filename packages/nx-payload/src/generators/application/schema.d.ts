export interface Schema {
  directory?: string;
  linter?: Linter;
  name: string;
  tags?: string;
  unitTestRunner?: 'jest' | 'none';
}
