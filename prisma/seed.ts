// Seed de demo — todavía NO son los datos reales de FUPA, son placeholder
// (los mismos que usaban los mocks) para no arrancar con la base vacía.
// Reemplazar por la carga real cuando la protectora la provea (ver backlog
// en AGENTS.md: "Datos reales de FUPA").
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const DEMO_PASSWORD = "happypaws123";

async function main() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  const fupaPasswordHash = await bcrypt.hash("123456", 10);

  const fupaAdmin = await prisma.user.upsert({
    where: { email: "fupa@gmail.com" },
    update: {},
    create: {
      email: "fupa@gmail.com",
      passwordHash: fupaPasswordHash,
      nombre: "FUPA",
      rol: "ADMIN_PROTECTORA",
    },
  });

  let fupa = await prisma.protectora.findFirst({ where: { duenioId: fupaAdmin.id } });
  if (!fupa) {
    fupa = await prisma.protectora.create({
      data: {
        nombre: "FUPA",
        ubicacion: "Villa Carlos Paz, Córdoba",
        descripcion:
          "Protectora piloto de Happy Paws, rescata y aloja animales en situación de calle.",
        email: "fupa@gmail.com",
        duenioId: fupaAdmin.id,
      },
    });
  }

  const huellitasAdmin = await prisma.user.upsert({
    where: { email: "huellitas@happypaws.demo" },
    update: {},
    create: {
      email: "huellitas@happypaws.demo",
      passwordHash,
      nombre: "Huellitas de Punilla",
      rol: "ADMIN_PROTECTORA",
    },
  });

  const huellitasExiste = await prisma.protectora.findFirst({ where: { duenioId: huellitasAdmin.id } });
  if (!huellitasExiste) {
    await prisma.protectora.create({
      data: {
        nombre: "Huellitas de Punilla",
        ubicacion: "Cosquín, Córdoba",
        descripcion: "Trabajan en conjunto con hogares de tránsito de la zona de Punilla.",
        email: "huellitas@happypaws.demo",
        duenioId: huellitasAdmin.id,
      },
    });
  }

  const mascotasExistentes = await prisma.mascota.count({ where: { protectoraId: fupa.id } });
  if (mascotasExistentes === 0) {
    const firulais = await prisma.mascota.create({
      data: {
        nombre: "Firulais",
        especie: "PERRO",
        razaTexto: "Mestizo",
        edadTexto: "2 años",
        tamanio: "MEDIANO",
        descripcion: "Muy juguetón y cariñoso, se lleva bien con otros perros.",
        aptaDepartamento: true,
        aptaNinos: true,
        nivelEnergia: "alto",
        conviveOtrasMascotas: true,
        protectoraId: fupa.id,
        vacunaciones: {
          create: [
            {
              nombreVacuna: "Polivalente (moquillo, parvovirus, hepatitis)",
              fechaAplicacion: new Date("2026-03-10"),
            },
            {
              nombreVacuna: "Antirrábica",
              fechaAplicacion: new Date("2026-03-15"),
              proximaDosis: new Date("2027-03-15"),
            },
          ],
        },
      },
    });

    const michi = await prisma.mascota.create({
      data: {
        nombre: "Michi",
        especie: "GATO",
        razaTexto: "Mestizo",
        edadTexto: "1 año",
        tamanio: "PEQUEÑO",
        descripcion: "Tranquila y curiosa, ideal para departamento.",
        aptaDepartamento: true,
        aptaNinos: true,
        nivelEnergia: "bajo",
        conviveOtrasMascotas: true,
        protectoraId: fupa.id,
        vacunaciones: {
          create: [
            {
              nombreVacuna: "Triple felina",
              fechaAplicacion: new Date("2026-02-05"),
              proximaDosis: new Date("2026-06-20"),
            },
          ],
        },
      },
    });

    await prisma.mascota.createMany({
      data: [
        {
          nombre: "Rocky",
          especie: "PERRO",
          razaTexto: "Labrador",
          edadTexto: "4 años",
          tamanio: "GRANDE",
          descripcion: "Energético, necesita espacio y paseos diarios.",
          aptaDepartamento: false,
          aptaNinos: true,
          nivelEnergia: "alto",
          conviveOtrasMascotas: false,
          protectoraId: fupa.id,
        },
        {
          nombre: "Luna",
          especie: "GATO",
          razaTexto: "Siamés",
          edadTexto: "3 años",
          tamanio: "PEQUEÑO",
          descripcion: "Independiente pero muy cariñosa con su familia.",
          aptaDepartamento: true,
          aptaNinos: false,
          nivelEnergia: "medio",
          conviveOtrasMascotas: false,
          protectoraId: fupa.id,
        },
      ],
    });

    console.log(`Mascotas creadas: ${firulais.nombre}, ${michi.nombre}, Rocky, Luna`);
  }

  const adoptanteDemo = await prisma.user.upsert({
    where: { email: "adoptante@happypaws.demo" },
    update: {},
    create: {
      email: "adoptante@happypaws.demo",
      passwordHash,
      nombre: "Ana Adoptante",
      rol: "ADOPTANTE",
      adoptante: { create: {} },
    },
  });

  console.log("Seed completo.");
  console.log("Usuarios de demo:");
  console.log("- Protectora FUPA: fupa@gmail.com / 123456");
  console.log("- Protectora Huellitas de Punilla: huellitas@happypaws.demo / " + DEMO_PASSWORD);
  console.log("- Adoptante: adoptante@happypaws.demo / " + DEMO_PASSWORD);
  void adoptanteDemo;
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
