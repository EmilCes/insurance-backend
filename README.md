## Stack
- Nest Js
- Prisma ORM
- Postgre SQL

# Instrucciones
1. Correr el comando npm install
2. Correr archivo initdb.sql cambiando la contraseña.
3. Crear un archivo .env en base a .env.example
4. Configura la cadena del .env.
5. Ejecuta el "comando npx prisma migrate deploy" para sincronizar la base de datos.

# Estructura
- En la carpeta prisma, en el archivo schema.prisma se crean y modifican las tablas de la base de datos.
- Para añadir un nuevo recurso creando su CRUD ejecutar el comando nest g resource