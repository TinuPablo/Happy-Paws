-- AlterTable
ALTER TABLE `users` ADD COLUMN `emailVerificadoEn` DATETIME(3) NULL;

-- CreateTable
CREATE TABLE `email_verification_tokens` (
    `id` VARCHAR(191) NOT NULL,
    `tokenHash` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `usedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `email_verification_tokens_tokenHash_key`(`tokenHash`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `email_verification_tokens` ADD CONSTRAINT `email_verification_tokens_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- Las cuentas que ya existían antes de pedir confirmación de correo quedan
-- verificadas: si no, nadie (FUPA, cuentas demo, admins) podría volver a entrar.
UPDATE `users` SET `emailVerificadoEn` = CURRENT_TIMESTAMP(3) WHERE `emailVerificadoEn` IS NULL;
