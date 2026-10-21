-- AlterTable
ALTER TABLE `protectoras` ADD COLUMN `cargoResponsable` VARCHAR(191) NULL,
    ADD COLUMN `estadoVerificacion` ENUM('PENDIENTE', 'APROBADA', 'RECHAZADA') NOT NULL DEFAULT 'APROBADA',
    ADD COLUMN `facebook` VARCHAR(191) NULL,
    ADD COLUMN `fechaRevision` DATETIME(3) NULL,
    ADD COLUMN `fechaSolicitud` DATETIME(3) NULL,
    ADD COLUMN `instagram` VARCHAR(191) NULL,
    ADD COLUMN `motivoRechazo` TEXT NULL,
    ADD COLUMN `nombreResponsable` VARCHAR(191) NULL,
    ADD COLUMN `sitioWeb` VARCHAR(191) NULL,
    ADD COLUMN `textoVerificacion` TEXT NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `rol` ENUM('ADMIN_PROTECTORA', 'COLABORADOR', 'HOGAR_TRANSITO', 'ADOPTANTE', 'ADMIN') NOT NULL;
