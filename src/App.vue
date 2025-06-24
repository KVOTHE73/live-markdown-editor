<template>
  <main class="p-8">
    <h1 class="text-2xl font-bold mb-4 text-center">{{ t("title") }}</h1>
    <MarkdownEditor />
  </main>
</template>

<script lang="ts" setup>
import MarkdownEditor from "./components/MarkdownEditor.vue";
import { useI18n } from "vue-i18n";

// 🌐 i18n
const { t } = useI18n();
</script>
