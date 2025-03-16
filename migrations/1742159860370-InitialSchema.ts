import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1697983456789 implements MigrationInterface {
  name = 'InitialSchema1697983456789';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Manuel olarak veritabanı oluşturma sorgularını yazın
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "users" ("id" SERIAL PRIMARY KEY, "name" VARCHAR(100) NOT NULL, "email" VARCHAR(100) UNIQUE NOT NULL, "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`
    );

    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "books" ("id" SERIAL PRIMARY KEY, "title" VARCHAR(200) NOT NULL, "author" VARCHAR(100) NOT NULL, "isbn" VARCHAR(20) UNIQUE, "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`
    );

    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "borrowings" ("id" SERIAL PRIMARY KEY, "user_id" INTEGER NOT NULL, "book_id" INTEGER NOT NULL, "borrow_date" TIMESTAMP DEFAULT CURRENT_TIMESTAMP, "return_date" TIMESTAMP NULL, "rating" INTEGER CHECK (rating >= 1 AND rating <= 5) NULL, "status" VARCHAR(20) NOT NULL DEFAULT 'borrowed', "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE, FOREIGN KEY ("book_id") REFERENCES "books" ("id") ON DELETE CASCADE)`
    );

    // İndeksleri oluşturun
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_users_email" ON "users" ("email")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_books_title" ON "books" ("title")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_books_author" ON "books" ("author")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_borrowings_user_id" ON "borrowings" ("user_id")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_borrowings_book_id" ON "borrowings" ("book_id")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_borrowings_status" ON "borrowings" ("status")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Geri alma işlemleri
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_borrowings_status"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_borrowings_book_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_borrowings_user_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_books_author"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_books_title"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_users_email"`);

    await queryRunner.query(`DROP TABLE IF EXISTS "borrowings"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "books"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
  }
}
