import { MigrationInterface, QueryRunner } from 'typeorm';

export class local1721755351924 implements MigrationInterface {
  name = 'local1721755351924';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'client')`);
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(255) NOT NULL, "username" character varying(60) NOT NULL, "password" character varying(255) NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'client', "phoneCode" character varying(5) NOT NULL DEFAULT '+1', "phoneNumber" character varying(15), "firstAddress" character varying(255), "secondAddress" character varying(255), "state" character varying(80), "city" character varying(80), "pincode" character varying(10), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "gateway_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "token" character varying(90) NOT NULL, "brand" character varying(10) NOT NULL, "lastFour" character varying(4) NOT NULL, "expMonth" character varying(2) NOT NULL, "expYear" character varying(2) NOT NULL, "cardHolder" character varying(100) NOT NULL, "expiredAt" date NOT NULL, "validityEndsAt" date NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_f53d1ffc86a74fe2e24bfbfc148" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "name" character varying(80), "description" character varying(800), "image" character varying(255), "price" numeric(10,0) NOT NULL, "stock" integer NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "transactions_products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "transactionId" uuid NOT NULL, "productId" uuid NOT NULL, "gatewayId" character varying(30) NOT NULL, "quantity" integer NOT NULL, "amount" numeric(10,0) NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_3071884a303e0684b0e51bd66a2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."transactions_status_enum" AS ENUM('APPROVED', 'PENDING', 'DECLINED', 'VOIDED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "transactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "gatewayId" character varying(30) NOT NULL, "gatewayTokenId" uuid NOT NULL, "reference" uuid NOT NULL, "totalAmount" numeric(10,0) NOT NULL, "status" "public"."transactions_status_enum" NOT NULL DEFAULT 'PENDING', "phoneCode" character varying(5) NOT NULL DEFAULT '+1', "phoneNumber" character varying(15), "firstAddress" character varying(255), "secondAddress" character varying(255), "state" character varying(80), "city" character varying(80), "pincode" character varying(10), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_70fa1c49a84c56354a1e78f9c26" UNIQUE ("gatewayId"), CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "transaction_config" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fixedRate" numeric(10,0) NOT NULL, "variablePercentage" numeric(5,3) NOT NULL, "shippingFee" numeric(10,0) NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_cc2422da6375090ce9c10489769" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "deliveries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "transactionId" uuid NOT NULL, "phoneCode" character varying(5) NOT NULL DEFAULT '+1', "phoneNumber" character varying(15) NOT NULL, "firstAddress" character varying(255) NOT NULL, "secondAddress" character varying(255) NOT NULL, "state" character varying(80) NOT NULL, "city" character varying(80) NOT NULL, "pincode" character varying(10) NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "REL_e070c3b27ee2b3f2097b9c6eb5" UNIQUE ("transactionId"), CONSTRAINT "PK_a6ef225c5c5f0974e503bfb731f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE TYPE "public"."sessions_type_enum" AS ENUM('anonymous', 'auth')`);
    await queryRunner.query(
      `CREATE TABLE "sessions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid, "jwt" text NOT NULL, "type" "public"."sessions_type_enum" NOT NULL DEFAULT 'anonymous', "expiredAt" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_3238ef96f18b355b671619111bc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE TYPE "public"."logs_priority_enum" AS ENUM('low', 'medium', 'high', 'critical')`);
    await queryRunner.query(
      `CREATE TABLE "logs" ("id" SERIAL NOT NULL, "userId" uuid, "request" jsonb NOT NULL, "response" jsonb, "priority" "public"."logs_priority_enum" NOT NULL DEFAULT 'low', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_fb1b805f2f7795de79fa69340ba" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "gateway_tokens" ADD CONSTRAINT "fk_gatewaytoken_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE RESTRICT`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "fk_product_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions_products" ADD CONSTRAINT "fk_transaction_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions_products" ADD CONSTRAINT "fk_tp_product" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions_products" ADD CONSTRAINT "fk_transaction_tp" FOREIGN KEY ("transactionId") REFERENCES "transactions"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD CONSTRAINT "fk_transaction_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD CONSTRAINT "fk_transaction_gatewaytoken" FOREIGN KEY ("gatewayTokenId") REFERENCES "gateway_tokens"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "deliveries" ADD CONSTRAINT "fk_delivery_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "deliveries" ADD CONSTRAINT "fk_delivery_transaction" FOREIGN KEY ("transactionId") REFERENCES "transactions"("id") ON DELETE CASCADE ON UPDATE RESTRICT`,
    );
    await queryRunner.query(
      `ALTER TABLE "sessions" ADD CONSTRAINT "fk_token_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE RESTRICT`,
    );
    await queryRunner.query(
      `ALTER TABLE "logs" ADD CONSTRAINT "fk_log_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE RESTRICT`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "logs" DROP CONSTRAINT "fk_log_user"`);
    await queryRunner.query(`ALTER TABLE "sessions" DROP CONSTRAINT "fk_token_user"`);
    await queryRunner.query(`ALTER TABLE "deliveries" DROP CONSTRAINT "fk_delivery_transaction"`);
    await queryRunner.query(`ALTER TABLE "deliveries" DROP CONSTRAINT "fk_delivery_user"`);
    await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "fk_transaction_gatewaytoken"`);
    await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "fk_transaction_user"`);
    await queryRunner.query(`ALTER TABLE "transactions_products" DROP CONSTRAINT "fk_transaction_tp"`);
    await queryRunner.query(`ALTER TABLE "transactions_products" DROP CONSTRAINT "fk_tp_product"`);
    await queryRunner.query(`ALTER TABLE "transactions_products" DROP CONSTRAINT "fk_transaction_user"`);
    await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "fk_product_user"`);
    await queryRunner.query(`ALTER TABLE "gateway_tokens" DROP CONSTRAINT "fk_gatewaytoken_user"`);
    await queryRunner.query(`DROP TABLE "logs"`);
    await queryRunner.query(`DROP TYPE "public"."logs_priority_enum"`);
    await queryRunner.query(`DROP TABLE "sessions"`);
    await queryRunner.query(`DROP TYPE "public"."sessions_type_enum"`);
    await queryRunner.query(`DROP TABLE "deliveries"`);
    await queryRunner.query(`DROP TABLE "transaction_config"`);
    await queryRunner.query(`DROP TABLE "transactions"`);
    await queryRunner.query(`DROP TYPE "public"."transactions_status_enum"`);
    await queryRunner.query(`DROP TABLE "transactions_products"`);
    await queryRunner.query(`DROP TABLE "products"`);
    await queryRunner.query(`DROP TABLE "gateway_tokens"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
  }
}
