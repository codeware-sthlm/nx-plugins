export interface Schema {
  name: string;
  skipFormat?: boolean;
  directory?: string;
  tags?: string;
  unitTestRunner?: 'jest' | 'none';
  linter?: Linter;
  skipWorkspaceJson?: boolean;
  js?: boolean;
  standaloneConfig?: boolean;
}
