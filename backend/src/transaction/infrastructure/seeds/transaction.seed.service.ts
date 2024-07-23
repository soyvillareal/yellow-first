import { v4 as uuidv4 } from 'uuid';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

import { TransactionConfigModel } from '../models/transaction-config.model';

export default class TransactionConfigDataSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    await dataSource
      .createQueryBuilder()
      .insert()
      .into(TransactionConfigModel)
      .values([
        {
          id: uuidv4(),
          fixedRate: '1000',
          variablePercentage: '0.029',
          shippingFee: '5000',
        },
      ])
      .execute();
  }
}
