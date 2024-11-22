-- DropForeignKey
ALTER TABLE "user_token" DROP CONSTRAINT "user_token_user_id_fkey";

-- AddForeignKey
ALTER TABLE "user_token" ADD CONSTRAINT "user_token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
