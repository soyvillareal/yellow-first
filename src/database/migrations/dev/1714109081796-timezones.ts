import { MigrationInterface, QueryRunner } from 'typeorm';

export class timezones1714109081796 implements MigrationInterface {
  name = 'timezones1714109081796';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "project" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "createdAt"`);
    await queryRunner.query(`ALTER TABLE "project" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "users" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "createdAt"`);
    await queryRunner.query(`ALTER TABLE "users" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "tokens" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "tokens" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "tokens" DROP COLUMN "createdAt"`);
    await queryRunner.query(`ALTER TABLE "tokens" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "logs" DROP COLUMN "createdAt"`);
    await queryRunner.query(`ALTER TABLE "logs" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "webhook_logs" DROP COLUMN "createdAt"`);
    await queryRunner.query(`ALTER TABLE "webhook_logs" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "dependencies" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "dependencies" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "dependencies" DROP COLUMN "createdAt"`);
    await queryRunner.query(`ALTER TABLE "dependencies" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "forms" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "forms" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "forms" DROP COLUMN "createdAt"`);
    await queryRunner.query(`ALTER TABLE "forms" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "custom_rows" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "custom_rows" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "custom_rows" DROP COLUMN "createdAt"`);
    await queryRunner.query(`ALTER TABLE "custom_rows" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "custom_rows" DROP COLUMN "createdAt"`);
    await queryRunner.query(`ALTER TABLE "custom_rows" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "custom_rows" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "custom_rows" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "forms" DROP COLUMN "createdAt"`);
    await queryRunner.query(`ALTER TABLE "forms" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "forms" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "forms" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "dependencies" DROP COLUMN "createdAt"`);
    await queryRunner.query(`ALTER TABLE "dependencies" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "dependencies" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "dependencies" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "webhook_logs" DROP COLUMN "createdAt"`);
    await queryRunner.query(`ALTER TABLE "webhook_logs" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "logs" DROP COLUMN "createdAt"`);
    await queryRunner.query(`ALTER TABLE "logs" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "tokens" DROP COLUMN "createdAt"`);
    await queryRunner.query(`ALTER TABLE "tokens" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "tokens" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "tokens" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "createdAt"`);
    await queryRunner.query(`ALTER TABLE "users" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "users" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "createdAt"`);
    await queryRunner.query(`ALTER TABLE "project" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "project" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
  }
}
