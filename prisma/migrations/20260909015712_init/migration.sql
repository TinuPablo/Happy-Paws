-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `telefono` VARCHAR(191) NULL,
    `rol` ENUM('ADMIN_PROTECTORA', 'COLABORADOR', 'HOGAR_TRANSITO', 'ADOPTANTE') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `protectoras` (
    `id` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `descripcion` TEXT NULL,
    `ubicacion` VARCHAR(191) NOT NULL,
    `telefono` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `redSocial` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `duenioId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `miembros_protectora` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `protectoraId` VARCHAR(191) NOT NULL,
    `rol` ENUM('COLABORADOR', 'HOGAR_TRANSITO') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `miembros_protectora_userId_protectoraId_rol_key`(`userId`, `protectoraId`, `rol`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mascotas` (
    `id` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `especie` ENUM('PERRO', 'GATO') NOT NULL,
    `razaId` INTEGER NULL,
    `edadAproxMeses` INTEGER NULL,
    `sexo` VARCHAR(191) NULL,
    `tamanio` VARCHAR(191) NULL,
    `descripcion` TEXT NULL,
    `fotos` JSON NULL,
    `estado` ENUM('EN_PROTECTORA', 'EN_TRANSITO', 'EN_PROCESO', 'ADOPTADO', 'FALLECIDO') NOT NULL DEFAULT 'EN_PROTECTORA',
    `fechaIngreso` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `protectoraId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `razas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `especie` ENUM('PERRO', 'GATO') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vacunaciones` (
    `id` VARCHAR(191) NOT NULL,
    `mascotaId` VARCHAR(191) NOT NULL,
    `nombreVacuna` VARCHAR(191) NOT NULL,
    `fechaAplicacion` DATETIME(3) NOT NULL,
    `proximaDosis` DATETIME(3) NULL,
    `observaciones` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `adoptantes` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `direccion` VARCHAR(191) NULL,
    `tipoVivienda` VARCHAR(191) NULL,
    `tieneOtrasMascotas` BOOLEAN NOT NULL DEFAULT false,
    `tieneHijos` BOOLEAN NOT NULL DEFAULT false,
    `experiencia` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `adoptantes_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `solicitudes_adopcion` (
    `id` VARCHAR(191) NOT NULL,
    `mascotaId` VARCHAR(191) NOT NULL,
    `adoptanteId` VARCHAR(191) NOT NULL,
    `estado` ENUM('PENDIENTE', 'EN_REVISION', 'APROBADA', 'RECHAZADA', 'CANCELADA') NOT NULL DEFAULT 'PENDIENTE',
    `mensaje` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `protectoras` ADD CONSTRAINT `protectoras_duenioId_fkey` FOREIGN KEY (`duenioId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `miembros_protectora` ADD CONSTRAINT `miembros_protectora_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `miembros_protectora` ADD CONSTRAINT `miembros_protectora_protectoraId_fkey` FOREIGN KEY (`protectoraId`) REFERENCES `protectoras`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mascotas` ADD CONSTRAINT `mascotas_protectoraId_fkey` FOREIGN KEY (`protectoraId`) REFERENCES `protectoras`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mascotas` ADD CONSTRAINT `mascotas_razaId_fkey` FOREIGN KEY (`razaId`) REFERENCES `razas`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vacunaciones` ADD CONSTRAINT `vacunaciones_mascotaId_fkey` FOREIGN KEY (`mascotaId`) REFERENCES `mascotas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `adoptantes` ADD CONSTRAINT `adoptantes_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `solicitudes_adopcion` ADD CONSTRAINT `solicitudes_adopcion_mascotaId_fkey` FOREIGN KEY (`mascotaId`) REFERENCES `mascotas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `solicitudes_adopcion` ADD CONSTRAINT `solicitudes_adopcion_adoptanteId_fkey` FOREIGN KEY (`adoptanteId`) REFERENCES `adoptantes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
