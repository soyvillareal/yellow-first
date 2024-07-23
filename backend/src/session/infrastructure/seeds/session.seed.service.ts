import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { hash } from 'bcrypt';

import { UsersModel } from '../models/users.model';
import { ERoles } from 'src/session/domain/entities/session.entity';

export default class SessionDataSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    await dataSource
      .createQueryBuilder()
      .insert()
      .into(UsersModel)
      .values([
        {
          id: '3cde8292-9a7a-4b1b-a9b7-50651bcf9854',
          username: 'admin',
          password: await hash('123456', 10),
          role: ERoles.ADMIN,
          email: 'admin@gmail.com',
          phoneCode: '+57',
          phoneNumber: '3106278931',
          firstAddress: '123 Calle Ficticia',
          secondAddress: 'Apartamento 456',
          state: 'California',
          city: 'Los Ángeles',
          pincode: '90001',
        },
        {
          id: 'f02b0691-c177-4484-93cd-85cb5b5546c1',
          username: 'client',
          password: await hash('123456', 10),
          role: ERoles.CLIENT,
          email: 'client@gmail.com',
          phoneCode: '+57',
          phoneNumber: '3209371923',
          firstAddress: '123 Calle Ficticia',
          secondAddress: 'Apartamento 456',
          state: 'California',
          city: 'Los Ángeles',
          pincode: '90001',
        },
      ])
      .execute();
  }
}
