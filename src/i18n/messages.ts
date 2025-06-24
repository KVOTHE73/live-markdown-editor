import type { Plugin } from "vue";
import { createI18n } from "vue-i18n";

const messages = {
  es: {
    "Cambiar tema": "Cambiar tema",
    title: "Editor Markdown",
    Negrita: "Negrita",
    Cursiva: "Cursiva",
    Lista: "Lista",
    Enlace: "Enlace",
    "Copiar HTML": "Copiar HTML",
    "Exportar HTML": "Exportar HTML",
    Limpiar: "Limpiar",
    Markdown: "Markdown",
    "Vista Previa": "Vista Previa",
    HTML: "HTML",
    placeholders: {
      markdown: "Escribe tu Markdown aquí...",
    },
    bienvenido: "Bienvenido al editor Markdown en vivo",
    lang: {
      es: "Español",
      en: "Inglés",
    },
    tabs: {
      Markdown: "Markdown",
      "Vista Previa": "Vista Previa",
      HTML: "HTML",
    },
  },
  en: {
    "Cambiar tema": "Toggle theme",
    title: "Live Markdown Editor",
    Negrita: "Bold",
    Cursiva: "Italic",
    Lista: "List",
    Enlace: "Link",
    "Copiar HTML": "Copy HTML",
    "Exportar HTML": "Export HTML",
    Limpiar: "Clear",
    Markdown: "Markdown",
    "Vista Previa": "Preview",
    HTML: "HTML",
    placeholders: {
      markdown: "Write your Markdown here...",
    },
    bienvenido: "Welcome to the live Markdown editor",
    lang: {
      es: "Spanish",
      en: "English",
    },
    tabs: {
      Markdown: "Markdown",
      "Vista Previa": "Preview",
      HTML: "HTML",
    },
  },
};

// ✅ Creamos instancia con Composition API habilitada
const i18n = createI18n({
  legacy: false,
  locale: navigator.language.startsWith("es") ? "es" : "en",
  fallbackLocale: "en",
  messages,
});

export const i18nPlugin = i18n as unknown as Plugin;

// 🟩 Exportamos la instancia (para app.use())
export default i18n;
