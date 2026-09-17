-- AlterTable
ALTER TABLE `solicitudes_adopcion` ADD COLUMN `quizEraRecomendada` BOOLEAN NULL,
    ADD COLUMN `quizPorcentaje` INTEGER NULL,
    ADD COLUMN `quizRespuestas` JSON NULL;
