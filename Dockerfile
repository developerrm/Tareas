# Etapa 1: construir la app
FROM node:18 as build

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar los archivos del proyecto
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del proyecto
COPY . .

# Construir la app para producción
RUN npm run build

# Etapa 2: usar NGINX para servir la app
FROM nginx:alpine

# Copiar los archivos construidos al directorio de NGINX
COPY --from=build /app/dist /usr/share/nginx/html

# Exponer el puerto 80 (NGINX)
EXPOSE 80

# Comando para iniciar NGINX
CMD ["nginx", "-g", "daemon off;"]
