# Sistema de gestión de curso y certificados

## Description

Proyecto API Rest para la gestión de cursos académicos y generación de certificados digitales. Entre sus principales características, tenemos:

- **Gestión de tipo de eventos**
- **Gestión de eventos**
- **Gestión de docentes**
- **Gestión de alumnos**
- **Gestión de certificados**
- **Gestión de archivos adjuntos**

## Tecnologías

- **Node.js**: El entorno de ejecución de Javascript.
- **Express**: El framework usado para el enrutamiento.
- **Sequelize**: El ORM para la interacción con la base de datos.
- **MySQL**: El gestor de base de datos relacional.

* **TypeScript**: El lenguaje de programación.

## Instalación

Sigue los siguientes pasos para instalar el proyecto localmente.

1. **Clonar el repositorio**:

   ```bash
   git clone [https://github.com/JuanRacchumiDev/sist-learning-backend.git](https://github.com/JuanRacchumiDev/sist-learning-backend.git)
   cd sist-learning-backend
   ```

2. **Instalar dependencias**:

   ```bash
   npm install
   ```

3. **Establece el archivo del entorno de trabajo**:
   Crea un archivo `.env` en la raíz del directorio y agrega las credenciales de acceso a la base datos y APIs de terceros.

   ```
   DB_NAME=
   DB_USER=
   DB_PASS=
   DB_HOST=
   DB_DIALECT=
   PORT=
   JWT_SECRET=
   EXPIRE_TOKEN=
   BASE_URL=
   NODE_ENV=
   TOKEN_API_DOCS=
   CORS_ALLOWED_ORIGIN=
   EXPIRE_TOKEN=
   EMAIL_USER_GMAIL=
   EMAIL_USER_GMAIL=
   ```

4. **Ejecuta la aplicación**:
   ```
   npm start
   ```
