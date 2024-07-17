import { MigrationInterface, QueryRunner } from 'typeorm';

export class init1714110059834 implements MigrationInterface {
  name = 'init1714110059834';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "project" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(80) NOT NULL, "webhook" character varying(2000), "webhookUser" character varying(120), "webhookPassword" character varying(120), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_dedfea394088ed136ddadeee89c" UNIQUE ("name"), CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('super', 'client')`);
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying(60) NOT NULL, "password" character varying(255) NOT NULL, "origin" character varying(60) NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'client', "projectName" character varying(60) NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_a39f573df258f980fd64ce2222" ON "users" ("projectName") `);
    await queryRunner.query(
      `CREATE TABLE "tokens" ("id" SERIAL NOT NULL, "userId" uuid NOT NULL, "token" text NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_3001e89ada36263dabf1fb6210a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "logs" ("id" SERIAL NOT NULL, "userId" uuid, "request" jsonb NOT NULL, "response" jsonb, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_fb1b805f2f7795de79fa69340ba" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "webhook_logs" ("id" SERIAL NOT NULL, "logId" integer NOT NULL, "request" jsonb, "response" jsonb, "type" character varying(80) NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_c41f6cdf59cdfe3704807650896" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "dependencies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "projectName" character varying(80) NOT NULL, "name" character varying(80) NOT NULL, "isDefault" boolean NOT NULL DEFAULT false, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_8f53f688eef7e30b2861da194e3" UNIQUE ("name"), CONSTRAINT "PK_9f1f03f8207f8df418ae3eca645" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "forms" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(80) NOT NULL, "dependenceName" character varying(80) NOT NULL, "isEnabled" boolean NOT NULL DEFAULT true, "isDefault" boolean NOT NULL DEFAULT false, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_ba062fd30b06814a60756f233da" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "leads" ("id" SERIAL NOT NULL, "userId" uuid NOT NULL, "name" character varying(80) NOT NULL, "surnames" character varying(80) NOT NULL, "email" character varying(255) NOT NULL, "phone_code" character varying(5) NOT NULL, "phone" character varying(25) NOT NULL, "city" character varying(80) NOT NULL, "country" character varying(80) NOT NULL, "origin" character varying(80) NOT NULL, "projectName" character varying(80) NOT NULL, "formId" uuid NOT NULL, "customValues" jsonb, "sent" boolean NOT NULL DEFAULT false, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_cd102ed7a9a4ca7d4d8bfeba406" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE TYPE "public"."custom_rows_type_enum" AS ENUM('text', 'number', 'date', 'file')`);
    await queryRunner.query(
      `CREATE TABLE "custom_rows" ("id" SERIAL NOT NULL, "name" character varying(80) NOT NULL, "formId" uuid NOT NULL, "label" character varying(80) NOT NULL, "type" "public"."custom_rows_type_enum" NOT NULL, "lengthRow" integer, "nulleable" boolean DEFAULT false, "isEnabled" boolean NOT NULL DEFAULT false, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_44e67503f6928ec25522509b568" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "fk_user_project" FOREIGN KEY ("projectName") REFERENCES "project"("name") ON DELETE RESTRICT ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "tokens" ADD CONSTRAINT "fk_token_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE RESTRICT`,
    );
    await queryRunner.query(
      `ALTER TABLE "logs" ADD CONSTRAINT "fk_log_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE RESTRICT`,
    );
    await queryRunner.query(
      `ALTER TABLE "webhook_logs" ADD CONSTRAINT "fk_wl_log" FOREIGN KEY ("logId") REFERENCES "logs"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "dependencies" ADD CONSTRAINT "fk_dependence_project" FOREIGN KEY ("projectName") REFERENCES "project"("name") ON DELETE RESTRICT ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "forms" ADD CONSTRAINT "fk_form_dependence" FOREIGN KEY ("dependenceName") REFERENCES "dependencies"("name") ON DELETE RESTRICT ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "leads" ADD CONSTRAINT "fk_lead_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "leads" ADD CONSTRAINT "fk_lead_project" FOREIGN KEY ("projectName") REFERENCES "project"("name") ON DELETE RESTRICT ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "leads" ADD CONSTRAINT "fk_cr_form" FOREIGN KEY ("formId") REFERENCES "forms"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "custom_rows" ADD CONSTRAINT "fk_cr_form" FOREIGN KEY ("formId") REFERENCES "forms"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "custom_rows" DROP CONSTRAINT "fk_cr_form"`);
    await queryRunner.query(`ALTER TABLE "leads" DROP CONSTRAINT "fk_cr_form"`);
    await queryRunner.query(`ALTER TABLE "leads" DROP CONSTRAINT "fk_lead_project"`);
    await queryRunner.query(`ALTER TABLE "leads" DROP CONSTRAINT "fk_lead_user"`);
    await queryRunner.query(`ALTER TABLE "forms" DROP CONSTRAINT "fk_form_dependence"`);
    await queryRunner.query(`ALTER TABLE "dependencies" DROP CONSTRAINT "fk_dependence_project"`);
    await queryRunner.query(`ALTER TABLE "webhook_logs" DROP CONSTRAINT "fk_wl_log"`);
    await queryRunner.query(`ALTER TABLE "logs" DROP CONSTRAINT "fk_log_user"`);
    await queryRunner.query(`ALTER TABLE "tokens" DROP CONSTRAINT "fk_token_user"`);
    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "fk_user_project"`);
    await queryRunner.query(`DROP TABLE "custom_rows"`);
    await queryRunner.query(`DROP TYPE "public"."custom_rows_type_enum"`);
    await queryRunner.query(`DROP TABLE "leads"`);
    await queryRunner.query(`DROP TABLE "forms"`);
    await queryRunner.query(`DROP TABLE "dependencies"`);
    await queryRunner.query(`DROP TABLE "webhook_logs"`);
    await queryRunner.query(`DROP TABLE "logs"`);
    await queryRunner.query(`DROP TABLE "tokens"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_a39f573df258f980fd64ce2222"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    await queryRunner.query(`DROP TABLE "project"`);
  }
}
