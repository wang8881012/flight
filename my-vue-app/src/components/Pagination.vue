<script setup>
import { defineEmits } from "vue";
const props = defineProps({
  currentPage: Number,
  totalPages: Number,
});
const emit = defineEmits(["page-change"]);

function changePage(page) {
  emit("page-change", page);
}
</script>

<template>
  <nav>
    <ul class="pagination justify-content-center">
      <li class="page-item" :class="{ disabled: currentPage === 1 }">
        <a class="page-link" @click="changePage(currentPage - 1)">上一頁</a>
      </li>

      <li
        v-for="page in totalPages"
        :key="page"
        class="page-item"
        :class="{ active: currentPage === page }"
      >
        <a class="page-link" @click="changePage(page)">{{ page }}</a>
      </li>

      <li class="page-item" :class="{ disabled: currentPage === totalPages }">
        <a class="page-link" @click="changePage(currentPage + 1)">下一頁</a>
      </li>
    </ul>
  </nav>
</template>
