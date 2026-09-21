-- CreateTable
CREATE TABLE `notificaciones` (
    `id` VARCHAR(191) NOT NULL,
    `protectoraId` VARCHAR(191) NOT NULL,
    `tipo` VARCHAR(191) NOT NULL,
    `mensaje` TEXT NOT NULL,
    `leida` BOOLEAN NOT NULL DEFAULT false,
    `solicitudId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `notificaciones` ADD CONSTRAINT `notificaciones_protectoraId_fkey` FOREIGN KEY (`protectoraId`) REFERENCES `protectoras`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notificaciones` ADD CONSTRAINT `notificaciones_solicitudId_fkey` FOREIGN KEY (`solicitudId`) REFERENCES `solicitudes_adopcion`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
