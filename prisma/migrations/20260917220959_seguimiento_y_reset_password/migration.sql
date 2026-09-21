-- CreateTable
CREATE TABLE `password_reset_tokens` (
    `id` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `usedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `password_reset_tokens_token_key`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `seguimientos_adopcion` (
    `id` VARCHAR(191) NOT NULL,
    `mascotaId` VARCHAR(191) NOT NULL,
    `tipo` ENUM('DIAS_7', 'MES_1', 'MES_3', 'MES_6') NOT NULL,
    `fechaProgramada` DATETIME(3) NOT NULL,
    `fechaRealizada` DATETIME(3) NULL,
    `nota` TEXT NULL,
    `fotoUrl` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `password_reset_tokens` ADD CONSTRAINT `password_reset_tokens_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `seguimientos_adopcion` ADD CONSTRAINT `seguimientos_adopcion_mascotaId_fkey` FOREIGN KEY (`mascotaId`) REFERENCES `mascotas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
