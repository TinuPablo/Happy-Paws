-- CreateTable
CREATE TABLE `invitaciones_protectora` (
    `id` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `protectoraId` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `rol` ENUM('COLABORADOR', 'HOGAR_TRANSITO') NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `usedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `invitaciones_protectora_token_key`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `invitaciones_protectora` ADD CONSTRAINT `invitaciones_protectora_protectoraId_fkey` FOREIGN KEY (`protectoraId`) REFERENCES `protectoras`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
