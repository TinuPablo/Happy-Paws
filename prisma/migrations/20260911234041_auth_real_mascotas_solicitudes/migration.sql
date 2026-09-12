-- AlterTable
ALTER TABLE `mascotas` ADD COLUMN `adoptanteId` VARCHAR(191) NULL,
    ADD COLUMN `edadTexto` VARCHAR(191) NULL,
    ADD COLUMN `mediaType` VARCHAR(191) NULL,
    ADD COLUMN `mediaUrl` TEXT NULL,
    ADD COLUMN `razaTexto` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `mascotas` ADD CONSTRAINT `mascotas_adoptanteId_fkey` FOREIGN KEY (`adoptanteId`) REFERENCES `adoptantes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
