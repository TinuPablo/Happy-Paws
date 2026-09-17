# Cambios que afectan al lado adoptante o archivos compartidos

Cada vez que yo (Daniel) modifique algo que impacte:
- archivos compartidos (prisma/schema.prisma, app/actions/solicitudes.ts, 
  app/layout.tsx, app/globals.css, app/components/**, lib/session.ts), o
- algo que el lado adoptante debería saber (ej: cambio de estructura de datos, 
  nuevo campo, endpoint nuevo, migración)

Agregá una entrada acá con fecha, qué cambió, y qué necesita hacer Pablo 
(ej: "pull + npx prisma migrate dev").
