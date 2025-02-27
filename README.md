# Pokémon Finder

![Pokémon Finder](https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png)

## 📋 Descripción

Pokémon Finder es una aplicación web moderna desarrollada con Next.js 15 que permite buscar y explorar información sobre Pokémon. La aplicación ofrece una interfaz intuitiva para buscar Pokémon por nombre, filtrar por hábitat y ver detalles como evoluciones y movimientos.

## ✨ Características

- **🔍 Búsqueda en tiempo real**: Encuentra Pokémon mientras escribes con sugerencias automáticas
- **🏞️ Filtrado por hábitat**: Filtra Pokémon por su hábitat natural (bosque, montaña, cueva, etc.)
- **🃏 Visualización de tarjetas**: Interfaz de tarjetas interactivas con animación de volteo
- **📊 Detalles de Pokémon**: Información sobre evoluciones y movimientos de cada Pokémon
- **📄 Paginación**: Navegación sencilla a través de los resultados
- **📱 Diseño responsive**: Funciona en dispositivos móviles y de escritorio
- **⚡ Optimizado para rendimiento**: Implementa caché y técnicas de optimización

## 🛠️ Tecnologías utilizadas

- **Frontend**: Next.js 15, React 18, TypeScript
- **Estilos**: Tailwind CSS
- **Testing**: Jest, React Testing Library
- **API**: PokeAPI
- **Containerización**: Docker
- **Patrones de diseño**: Container/Presentational, Context API, Custom Hooks

## 📋 Requisitos previos

- Node.js 18.x o superior
- npm 8.x o superior
- Docker y Docker Compose (opcional, para ejecución containerizada)

## 🚀 Instalación y ejecución local

### Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/pokemon-finder.git
cd pokemon-finder
```
### Instalar dependencias

```bash
npm install
```

### Ejecutar en Dev

```bash
npm run dev
```
La aplicación estará disponible en http://localhost:3000

### Ejecutar en Prod
```bash
npm start
```

# 🐳 Ejecución con Docker
## Requisitos
Docker instalado en tu sistema
Docker Compose instalado (incluido con Docker Desktop en Windows/Mac)

### Docker instalado en tu sistema
```bash
docker-compose build
docker-compose up
```
La aplicación estará disponible en http://localhost:3000

### Detener la aplicación Docker
```bash
docker-compose down
```

# 🔧 Solución de problemas con Docker
## Error de ESLint durante la construcción
El proyecto está configurado para ignorar errores de ESLint durante la construcción Docker mediante:
```bash
RUN NEXT_DISABLE_ESLINT=1 npm run build
```

Si sigues teniendo problemas, puedes reconstruir la imagen con:

```bash
docker-compose build --no-cache
```


# 📁 Estructura del proyecto
```bash
pokemon-finder/
├── public/                  # Archivos estáticos
├── src/
│   ├── app/                 # Estructura de la aplicación Next.js
│   │   └── page.tsx         # Página principal
│   ├── components/          # Componentes React
│   │   ├── ErrorMessage.tsx
│   │   ├── HomePage.tsx
│   │   ├── PageHeader.tsx
│   │   ├── Pagination.tsx
│   │   ├── PokemonCard.tsx
│   │   ├── PokemonList.tsx
│   │   ├── ResultsSummary.tsx
│   │   ├── SearchBar.tsx
│   │   └── __tests__/       # Tests de componentes
│   ├── context/             # Contextos de React
│   │   └── PokemonContext.tsx
│   ├── hooks/               # Custom hooks
│   │   ├── useDebounce.ts
│   │   ├── usePokemon.ts
│   │   └── __tests__/       # Tests de hooks
│   ├── services/            # Servicios y API
│   │   ├── pokeApi.ts
│   │   └── __tests__/       # Tests de servicios
│   └── types/               # Definiciones de TypeScript
│       └── pokemon.ts
├── .dockerignore            # Archivos ignorados por Docker
├── .gitignore               # Archivos ignorados por Git
├── Dockerfile               # Configuración de Docker
├── docker-compose.yml       # Configuración de Docker Compose
├── jest.config.js           # Configuración de Jest
├── next.config.ts           # Configuración de Next.js
├── package.json             # Dependencias y scripts
├── postcss.config.mjs       # Configuración de PostCSS
├── tailwind.config.ts       # Configuración de Tailwind CSS
└── tsconfig.json            # Configuración de TypeScript
```

# 🏗️ Arquitectura de la aplicación

La aplicación sigue una arquitectura basada en componentes con separación clara de responsabilidades:

- **Componentes de presentación:** Encargados únicamente de renderizar la UI
- **Componentes contenedores:** Manejan la lógica y el estado
- **Contexto:** Proporciona estado global a través de React Context API
- **Custom Hooks:** Encapsulan la lógica de negocio y el acceso a datos
- **Servicios:** Manejan la comunicación con APIs externas

#🧪 Testing
El proyecto incluye tests unitarios y de integración utilizando Jest y React Testing Library.

### Ejecutar tests
```bash
npm test
```

### Ejecutar tests con cobertura

```bash
npm run test:coverage
```


# 🤝 Contribución
Las contribuciones son bienvenidas. Por favor, sigue estos pasos:

Haz fork del repositorio
Crea una rama para tu feature (git checkout -b feature/feature)
Haz commit de tus cambios (git commit -m 'Add some  feature')
Haz push a la rama (git push origin feature/feature)
Abre un Pull Request

📞 Contacto
Tu Nombre - **romero.marcelo.ar@gmail.com**


Enlace del proyecto: https://github.com/mar-romero/Pokemon-Finder-IxPandit