<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  currentPage: Number,
  totalPages: Number,
});
const emit = defineEmits(["page-change"]);

const jumpPage = ref(props.currentPage);

watch(
  () => props.currentPage,
  (val) => (jumpPage.value = val)
);

function changePage(page) {
  if (page >= 1 && page <= props.totalPages) {
    emit("page-change", page);
  }
}

function getPageNumbers() {
  const total = props.totalPages;
  const current = props.currentPage;
  const pages = [];

  if (total <= 7) {
    // 全部顯示
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    pages.push(1); // 第一頁

    if (current > 4) pages.push("...");

    const start = Math.max(2, current - 2);
    const end = Math.min(total - 1, current + 2);
    for (let i = start; i <= end; i++) pages.push(i);

    if (current < total - 3) pages.push("...");

    pages.push(total); // 最後一頁
  }

  return pages;
}

function handleJump() {
  const page = parseInt(jumpPage.value);
  if (!isNaN(page)) changePage(page);
}
</script>

<template>
  <nav>
    <ul class="pagination justify-content-center align-items-center">
      <li class="page-item" :class="{ disabled: currentPage === 1 }">
        <a class="page-link" @click="changePage(currentPage - 1)">«</a>
      </li>

      <li
        v-for="page in getPageNumbers()"
        :key="page"
        class="page-item"
        :class="{ active: currentPage === page, disabled: page === '...' }"
      >
        <span class="page-link" v-if="page === '...'">…</span>
        <a v-else class="page-link" @click="changePage(page)">
          {{ page }}
        </a>
      </li>

      <li class="page-item" :class="{ disabled: currentPage === totalPages }">
        <a class="page-link" @click="changePage(currentPage + 1)">»</a>
      </li>

      <!-- 跳頁 -->
      <li class="ms-3 d-flex align-items-center">
        <span>跳轉至</span>
        <input
          type="number"
          class="form-control mx-2"
          style="width: 80px"
          v-model.number="jumpPage"
          min="1"
          :max="totalPages"
          @keyup.enter="handleJump"
        />
        <button class="btn btn-outline-primary btn-sm" @click="handleJump">
          前往
        </button>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.pagination:hover {
  cursor: pointer;
}
</style>
