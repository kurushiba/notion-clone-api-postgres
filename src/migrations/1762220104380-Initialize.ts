import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitializePostgres1762400000000 implements MigrationInterface {
  name = 'InitializePostgres1762400000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Userテーブルの作成
    await queryRunner.query(`
            CREATE TABLE "user" (
                "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                "name" varchar NOT NULL,
                "email" varchar NOT NULL,
                "password" varchar NOT NULL,
                "createdAt" timestamp NOT NULL DEFAULT now(),
                "updatedAt" timestamp NOT NULL DEFAULT now()
            )
        `);

    // emailのユニークインデックス
    await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email")
        `);

    // Notesテーブルの作成
    await queryRunner.query(`
            CREATE TABLE "notes" (
                "id" SERIAL PRIMARY KEY,
                "userId" uuid NOT NULL,
                "title" varchar,
                "content" text,
                "parentId" integer,
                "createdAt" timestamp NOT NULL DEFAULT now(),
                "updatedAt" timestamp NOT NULL DEFAULT now(),
                CONSTRAINT "FK_829532ff766505ad7c71592c6a5" 
                    FOREIGN KEY ("userId") 
                    REFERENCES "user" ("id") 
                    ON DELETE CASCADE,
                CONSTRAINT "FK_a6d728a29941461d789c7c98f3d" 
                    FOREIGN KEY ("parentId") 
                    REFERENCES "notes" ("id") 
                    ON DELETE CASCADE
            )
        `);

    // Notesテーブルのインデックス
    await queryRunner.query(`
            CREATE INDEX "IDX_829532ff766505ad7c71592c6a" ON "notes" ("userId")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_a6d728a29941461d789c7c98f3" ON "notes" ("parentId")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_a515a13f03ef7ad02efeedc071" ON "notes" ("createdAt")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_a515a13f03ef7ad02efeedc071"`);
    await queryRunner.query(`DROP INDEX "IDX_a6d728a29941461d789c7c98f3"`);
    await queryRunner.query(`DROP INDEX "IDX_829532ff766505ad7c71592c6a"`);
    await queryRunner.query(`DROP TABLE "notes"`);
    await queryRunner.query(`DROP INDEX "IDX_e12875dfb3b1d92d7d7c5377e2"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
