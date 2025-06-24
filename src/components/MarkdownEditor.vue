<template>
  <!--
  ========================================================================
  🔷 MARKDOWN EDITOR COMPONENT
     💡 Editor completo con vista previa en vivo, resaltado de sintaxis,
        modo oscuro, pestañas de vista, exportación, y más.
        🔹 Es parte del portfolio y está diseñado para fines demostrativos.
        🔹 Utiliza `marked` y `highlight.js` para el parseo de Markdown.
        🔹 Estilizado manualmente con CSS para mayor control estético.
  ========================================================================
  -->
  <div class="markdown-editor">
    <!-- 🔘 Barra de herramientas -->
    <div class="toolbar">
      <button
        v-for="btn in toolbarButtons"
        :key="btn.title"
        :title="btn.title"
        :aria-label="btn.title"
        @click="btn.action"
      >
        {{ btn.label }}
      </button>

      <!-- 🌐 Selector de idioma -->
      <div class="lang-switch">
        <button
          @click="setLang('es')"
          :aria-label="t('lang.es')"
          :title="t('lang.es')"
          :class="{ active: isLangEs }"
        >
          <img :src="flagEs" alt="Español" class="flag" />
        </button>
        <button
          @click="setLang('en')"
          :aria-label="t('lang.en')"
          :title="t('lang.en')"
          :class="{ active: isLangEn }"
        >
          <img :src="flagEn" alt="English" class="flag" />
        </button>
      </div>
    </div>

    <!-- 🧭 Navegación entre vistas -->
    <div class="tabs">
      <button
        v-for="opt in viewModes"
        :key="opt"
        :class="{ active: mode === opt }"
        @click="mode = opt"
      >
        {{ t("tabs." + opt) }}
      </button>
    </div>

    <!-- 🔳 Panel principal -->
    <div class="panels">
      <!-- 📝 Área de edición Markdown -->
      <textarea
        ref="ta"
        v-model="markdownText"
        class="editor"
        :placeholder="t('placeholders.markdown')"
        v-show="mode === 'Markdown'"
      ></textarea>

      <!-- 📄 Vista en HTML plano -->
      <pre class="html-view" v-if="mode === 'HTML'">{{ renderedHtml }}</pre>

      <!-- 👁 Vista previa con HTML renderizado -->
      <div
        class="preview prose dark:prose-invert"
        v-html="renderedHtml"
        v-show="mode === 'Vista Previa'"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
// ⛳ Imports
import { ref, watch, computed, onMounted } from "vue";
import { marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import { useI18n } from "vue-i18n";
import flagEs from "../assets/flags/es.png";
import flagEn from "../assets/flags/en.png";

// 🌐 i18n
const { t, locale } = useI18n();
const setLang = (lang: string) => (locale.value = lang);
const isLangEs = computed(() => locale.value === "es");
const isLangEn = computed(() => locale.value === "en");

// 📁 Estado global y de configuración

// 🌙 Tema claro/oscuro (oscuro por defecto, respeta el estado anterior si se recarga)
const storedTheme = localStorage.getItem("theme");
const theme = ref<"light" | "dark">(storedTheme === "light" ? "light" : "dark");
document.documentElement.classList.toggle("dark", theme.value === "dark");
const toggleTheme = () => {
  theme.value = theme.value === "light" ? "dark" : "light";
  document.documentElement.classList.toggle("dark", theme.value === "dark");
  localStorage.setItem("theme", theme.value);
};

// ✨ Configuración de Markdown con resaltado de código
marked.use(
  markedHighlight({
    highlight: (code, lang) => hljs.highlightAuto(code, [lang]).value,
  })
);

// 📄 Estados principales
const markdownText = ref("");
const renderedHtml = ref("");
// Flag para saber si el texto fue autogenerado
const isDefaultIntro = ref(true);

// 🎛️ Modos de visualización disponibles
const viewModes = ["Markdown", "Vista Previa", "HTML"] as const;
type ViewMode = (typeof viewModes)[number];
const mode = ref<ViewMode>("Vista Previa");

// 🧠 Renderizado del Markdown con debounce
let timeoutId: number;
watch(
  markdownText,
  (val) => {
    clearTimeout(timeoutId);
    timeoutId = window.setTimeout(async () => {
      const result = await marked(val);
      renderedHtml.value = result;
      localStorage.setItem("markdown-draft", val);
    }, 30);
  },
  { immediate: true }
);

// 🔄 Cambiar el título del documento y, si el texto es el default, actualizarlo
watch(
  locale,
  () => {
    document.title = t("title");
    if (isDefaultIntro.value) {
      markdownText.value = `# ${t("bienvenido")}`;
    }
  },
  { immediate: true }
);

// 🧩 Refs y helpers
const ta = ref<HTMLTextAreaElement | null>(null);

// ✍️ Envolver selección con prefijo/sufijo
const wrap = (prefix: string, suffix: string) => {
  const el = ta.value;
  if (!el) return;
  const start = el.selectionStart;
  const end = el.selectionEnd;
  const text = markdownText.value;
  markdownText.value =
    text.slice(0, start) +
    prefix +
    text.slice(start, end) +
    suffix +
    text.slice(end);
  el.focus();
  el.setSelectionRange(
    end + prefix.length + suffix.length,
    end + prefix.length + suffix.length
  );
};

// 🧰 Botones de la toolbar (reactivos al tema actual)
const toolbarButtons = computed(() => [
  {
    label: theme.value === "light" ? "🌙" : "☀️",
    title: t("Cambiar tema"),
    action: toggleTheme,
  },
  { label: "B", title: t("Negrita"), action: () => wrap("**", "**") },
  { label: "I", title: t("Cursiva"), action: () => wrap("_", "_") },
  { label: "•", title: t("Lista"), action: () => wrap("- ", "") },
  { label: "🔗", title: t("Enlace"), action: () => wrap("[", "](url)") },
  {
    label: "📋",
    title: t("Copiar HTML"),
    action: async () => await navigator.clipboard.writeText(renderedHtml.value),
  },
  {
    label: "💾",
    title: t("Exportar HTML"),
    action: () => {
      const html = `<!DOCTYPE html><html><head><meta charset='utf-8'/><title>Markdown</title><style>body{font-family:sans-serif;padding:2rem;}pre,code{background:#f4f4f4;padding:0.2em;}</style></head><body>${renderedHtml.value}</body></html>`;
      const blob = new Blob([html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "markdown.html";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
  },
  { label: "🧹", title: t("Limpiar"), action: () => (markdownText.value = "") },
]);

// 📝 Estado para saber si es el texto de introducción por defecto
onMounted(() => {
  const saved = localStorage.getItem("markdown-draft");
  if (saved) {
    markdownText.value = saved;
    isDefaultIntro.value = false;
  } else {
    markdownText.value = `# ${t("bienvenido")}`;
    isDefaultIntro.value = true;
  }
});
</script>

<style>
/* 🌗 Variables de color para modo claro y oscuro */
:root {
  --bg: #ffffff;
  --fg: #1a1a1a;
  --panel: #f5f5f5;
  --border: #ccc;
}
html.dark {
  --bg: #1e1e1e;
  --fg: #f0f0f0;
  --panel: #2b2b2b;
  --border: #444;
}

/* 🧱 Contenedor principal del editor */
.markdown-editor {
  background: var(--bg);
  color: var(--fg);
  max-width: 1000px;
  margin: 2rem auto;
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.05);
  font-family: system-ui, sans-serif;
}

/* 🛠️ Barra de herramientas superior */
.toolbar {
  background: var(--panel);
  border-bottom: 1px solid var(--border);
  padding: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.toolbar button {
  background: var(--bg);
  color: var(--fg);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 6px 10px;
  cursor: pointer;
  font-weight: bold;
  transition: 0.2s ease;
}
.toolbar button:hover {
  background: var(--panel);
}

/* 🌐 Selector de idioma */
.lang-switch {
  margin-left: auto;
  display: flex;
  gap: 0.5rem;
}

.flag {
  width: 24px;
  height: 16px;
  border-radius: 2px;
  object-fit: cover;
  transition: transform 0.2s ease;
}

.lang-switch button {
  background: transparent;
  border: none;
  padding: 2px;
  cursor: pointer;
  border-radius: 4px;
}

.lang-switch button.active {
  box-shadow: 0 0 0 2px var(--border);
  transform: scale(1.1);
}

/* 🧭 Pestañas de navegación (Markdown | Preview | HTML) */
.tabs {
  display: flex;
  justify-content: center;
  gap: 1rem;
  border-bottom: 1px solid var(--border);
  background: var(--panel);
  padding: 0.5rem 0;
}
.tabs button {
  background: transparent;
  border: none;
  color: var(--fg);
  font-weight: 600;
  cursor: pointer;
  padding: 0.3rem 0.8rem;
  border-bottom: 2px solid transparent;
  transition: border-color 0.2s;
}
.tabs button.active {
  border-color: var(--fg);
}

/* 🧱 Panel contenedor de las vistas */
.panels {
  display: block;
  padding: 1rem;
  background: var(--bg);
  min-height: 73vh; /* igual altura para todas las vistas */
}

/* 📝 Editor de texto Markdown */
textarea.editor {
  width: 100%;
  height: 100%;
  resize: none;
  border: none;
  outline: none;
  font-family: "JetBrains Mono", monospace;
  font-size: 1rem;
  background-color: var(--bg);
  color: var(--fg);
  min-height: 72vh;
}

/* 👁 Vista previa del Markdown */
.preview {
  height: 100%;
  overflow-y: auto;
  white-space: pre-wrap;
  padding: 1rem;
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 1rem;
  font-family: Georgia, Cambria, "Times New Roman", Times, serif;
  line-height: 1.6;
  min-height: 70vh;
}

/* 🧾 Vista HTML cruda (resultado del Markdown renderizado) */
.html-view {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden; /* 💡 evita scroll horizontal */
  white-space: pre-wrap; /* 🔁 evita scroll horizontal por líneas largas */
  word-break: break-word; /* 🧠 fuerza el ajuste de palabras largas */
  font-size: 1rem;
  font-family: monospace;
}
</style>
