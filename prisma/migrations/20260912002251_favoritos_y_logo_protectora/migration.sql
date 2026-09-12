-- AlterTable
ALTER TABLE `protectoras` ADD COLUMN `logoUrl` TEXT NULL;

-- CreateTable
CREATE TABLE `favoritos` (
    `id` VARCHAR(191) NOT NULL,
    `adoptanteId` VARCHAR(191) NOT NULL,
    `mascotaId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `favoritos_adoptanteId_mascotaId_key`(`adoptanteId`, `mascotaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `favoritos` ADD CONSTRAINT `favoritos_adoptanteId_fkey` FOREIGN KEY (`adoptanteId`) REFERENCES `adoptantes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `favoritos` ADD CONSTRAINT `favoritos_mascotaId_fkey` FOREIGN KEY (`mascotaId`) REFERENCES `mascotas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
