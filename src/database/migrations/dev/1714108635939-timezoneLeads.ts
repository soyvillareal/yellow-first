import { MigrationInterface, QueryRunner } from 'typeorm';

export class timezoneLeads1714108635939 implements MigrationInterface {
  name = 'timezoneLeads1714108635939';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "leads" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "leads" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "leads" DROP COLUMN "createdAt"`);
    await queryRunner.query(`ALTER TABLE "leads" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "leads" DROP COLUMN "createdAt"`);
    await queryRunner.query(`ALTER TABLE "leads" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "leads" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "leads" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
  }
}
