// postcss.config.cjs
module.exports = {
    plugins: [
      require('@tailwindcss/postcss'),  // ← aquí el plugin de Tailwind v4
      require('autoprefixer'),
    ],
  }
  