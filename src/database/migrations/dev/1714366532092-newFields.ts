import { MigrationInterface, QueryRunner } from 'typeorm';

export class newFields1714366532092 implements MigrationInterface {
  name = 'newFields1714366532092';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "api_usage" ("id" SERIAL NOT NULL, "userId" uuid NOT NULL, "apiUsage" integer NOT NULL DEFAULT '0', "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_41ae86fbe940afcecd47221edb9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "users" ADD "tokenLimit" integer NOT NULL DEFAULT '0'`);
    await queryRunner.query(`ALTER TABLE "users" ADD "apiLimit" integer NOT NULL DEFAULT '0'`);
    await queryRunner.query(`CREATE TYPE "public"."logs_priority_enum" AS ENUM('low', 'medium', 'high', 'critical')`);
    await queryRunner.query(`ALTER TABLE "logs" ADD "priority" "public"."logs_priority_enum" NOT NULL DEFAULT 'low'`);
    await queryRunner.query(`CREATE TYPE "public"."forms_source_enum" AS ENUM('external', 'web')`);
    await queryRunner.query(`ALTER TABLE "forms" ADD "source" "public"."forms_source_enum" NOT NULL DEFAULT 'external'`);
    await queryRunner.query(`ALTER TABLE "forms" ADD "skipFields" text array`);
    await queryRunner.query(`ALTER TABLE "custom_rows" ADD "isOptional" boolean NOT NULL DEFAULT false`);
    await queryRunner.query(`ALTER TABLE "leads" ALTER COLUMN "name" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "leads" ALTER COLUMN "surnames" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "leads" ALTER COLUMN "email" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "leads" ALTER COLUMN "phone_code" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "leads" ALTER COLUMN "phone" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "leads" ALTER COLUMN "city" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "leads" ALTER COLUMN "country" DROP NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "api_usage" ADD CONSTRAINT "fk_token_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE RESTRICT`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "api_usage" DROP CONSTRAINT "fk_token_user"`);
    await queryRunner.query(`ALTER TABLE "leads" ALTER COLUMN "country" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "leads" ALTER COLUMN "city" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "leads" ALTER COLUMN "phone" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "leads" ALTER COLUMN "phone_code" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "leads" ALTER COLUMN "email" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "leads" ALTER COLUMN "surnames" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "leads" ALTER COLUMN "name" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "custom_rows" DROP COLUMN "isOptional"`);
    await queryRunner.query(`ALTER TABLE "forms" DROP COLUMN "skipFields"`);
    await queryRunner.query(`ALTER TABLE "forms" DROP COLUMN "source"`);
    await queryRunner.query(`DROP TYPE "public"."forms_source_enum"`);
    await queryRunner.query(`ALTER TABLE "logs" DROP COLUMN "priority"`);
    await queryRunner.query(`DROP TYPE "public"."logs_priority_enum"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "apiLimit"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "tokenLimit"`);
    await queryRunner.query(`DROP TABLE "api_usage"`);
  }
}
