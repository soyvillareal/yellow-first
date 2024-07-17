export interface commonRepository {
  getTableColumns: (table: string) => Promise<string[]>;
}
