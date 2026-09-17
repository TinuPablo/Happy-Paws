-- AlterTable
ALTER TABLE `mascotas` ADD COLUMN `aptaDepartamento` BOOLEAN NULL,
    ADD COLUMN `aptaNinos` BOOLEAN NULL,
    ADD COLUMN `conviveOtrasMascotas` BOOLEAN NULL,
    ADD COLUMN `nivelEnergia` VARCHAR(191) NULL;
