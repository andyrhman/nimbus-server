-- CreateTable
CREATE TABLE "user_token" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "token" INTEGER NOT NULL,
    "expiresAt" BIGINT NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "user_token_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_token" ADD CONSTRAINT "user_token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
