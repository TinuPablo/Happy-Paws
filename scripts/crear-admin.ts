// Crea una cuenta ADMIN de Happy Paws (la que revisa protectoras en
// /admin/protectoras). Uso: npm run admin:crear
// Pide email y contraseña por terminal; no quedan guardados en ningún
// archivo. La contraseña se hashea igual que en el registro real (bcrypt, 10).
import readline from "node:readline";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const EMAIL_REGEX = /^[^\s@<>()",;:]+@[^\s@<>()",;:]+\.[^\s@<>()",;:]+$/;

const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
let ocultar = false;
// Mientras se tipea la contraseña no se muestra nada en pantalla.
const rlInterno = rl as unknown as { _writeToOutput: (s: string) => void };
const escribirOriginal = rlInterno._writeToOutput.bind(rl);
rlInterno._writeToOutput = (s: string) => {
  if (!ocultar) escribirOriginal(s);
  else if (s.includes("\n")) escribirOriginal("\n");
};

function preguntar(texto: string, secreto = false): Promise<string> {
  return new Promise((resolve) => {
    rl.question(texto, (respuesta) => {
      ocultar = false;
      resolve(respuesta);
    });
    ocultar = secreto;
  });
}

async function main() {
  const nombre = (await preguntar("Nombre para mostrar (ej: Equipo Happy Paws): ")).trim() || "Equipo Happy Paws";
  const email = (await preguntar("Email del admin: ")).trim().toLowerCase();
  if (!EMAIL_REGEX.test(email)) throw new Error("Ese email no tiene un formato válido.");

  const existente = await prisma.user.findUnique({ where: { email } });
  if (existente) throw new Error("Ya existe una cuenta con ese email. Usá otro.");

  const password = await preguntar("Contraseña (no se muestra): ", true);
  if (password.length < 8) throw new Error("Para una cuenta admin, usá al menos 8 caracteres.");
  const repetida = await preguntar("Repetí la contraseña: ", true);
  if (password !== repetida) throw new Error("Las contraseñas no coinciden.");

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({ data: { email, nombre, passwordHash, rol: "ADMIN" } });
  console.log(`\nListo: ${email} ya puede iniciar sesión y entrar a /admin/protectoras.`);
}

main()
  .catch((err) => {
    console.error(`\nNo se creó el admin: ${(err as Error).message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    rl.close();
    await prisma.$disconnect();
  });
