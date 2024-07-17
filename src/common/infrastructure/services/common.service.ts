import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

import { commonRepository } from 'src/common/domain/repository/common.repository';

@Injectable()
export class CommonService implements commonRepository {
  constructor(@InjectEntityManager() private readonly manager: EntityManager) {}

  public getTableColumns = async (table: string): Promise<string[]> => {
    try {
      const columns = this.manager.getRepository(table).metadata.columns;

      return columns.map((column) => column.propertyName);
    } catch (error) {
      console.error('ERROR :: Data Source initialization error', error);
      return null;
    }
  };
}
