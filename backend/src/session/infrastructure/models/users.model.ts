import { BaseEntity, BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import bcrypt from 'bcrypt';

import { ERoles, IUsersEntity } from 'src/session/domain/entities/session.entity';

@Entity({ name: 'users' })
export class UsersModel extends BaseEntity implements IUsersEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 60, nullable: false, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  password: string;

  @Column({ type: 'enum', enum: ERoles, default: ERoles.CLIENT, nullable: false })
  role: ERoles;

  @Column({ type: 'varchar', length: 5, nullable: false, default: '+1' })
  phoneCode: string;

  @Column({ type: 'varchar', length: 15, nullable: true, default: null })
  phoneNumber: string;

  @Column({ type: 'varchar', length: 255, nullable: true, default: null })
  firstAddress: string;

  @Column({ type: 'varchar', length: 255, nullable: true, default: null })
  secondAddress: string;

  @Column({ type: 'varchar', length: 80, nullable: true, default: null })
  state: string;

  @Column({ type: 'varchar', length: 80, nullable: true, default: null })
  city: string;

  @Column({ type: 'varchar', length: 10, nullable: true, default: null })
  pincode: string;

  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  updatedAt: Date;

  @Column({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  createdAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
}
