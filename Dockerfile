# Etapa de construcción
FROM node:20.10-alpine AS builder

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración
COPY package.json package-lock.json* ./
COPY tsconfig.json tsconfig.jest.json ./
COPY next.config.ts ./
COPY postcss.config.mjs tailwind.config.ts ./

# Instalar dependencias
RUN npm ci

# Copiar el código fuente completo
COPY . .

# Construir la aplicación
RUN NEXT_DISABLE_ESLINT=1 npm run build

# Etapa de producción
FROM node:20.10-alpine AS runner

WORKDIR /app

# Crear un usuario no root
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Establecer variables de entorno para producción
ENV NODE_ENV=production

# Copiar dependencias y archivos de construcción desde la etapa anterior
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Cambiar propiedad de los archivos al usuario no root
RUN chown -R nextjs:nodejs /app

# Cambiar al usuario no root
USER nextjs

# Exponer el puerto que usa Next.js
EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Comando para iniciar la aplicación
CMD ["npm", "start"]
