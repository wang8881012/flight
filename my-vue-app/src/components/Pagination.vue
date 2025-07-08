<script setup>
import { computed, ref, watch } from "vue";

const props = defineProps({
  currentPage: Number,
  perPage: Number,
  totalItems: Number,
});
const emit = defineEmits(["page-change"]);

const jumpPage = ref(props.currentPage);

// 總頁數
const totalPages = computed(() =>
  Math.max(1, Math.ceil(props.totalItems / props.perPage || 10))
);

// 同步跳頁輸入框
watch(
  () => props.currentPage,
  (val) => {
    jumpPage.value = val;
  }
);

// 計算要顯示的頁碼陣列
const pageNumbers = computed(() => {
  const total = totalPages.value;
  const current = props.currentPage;
  const maxVisible = 5;
  const pages = [];

  if (total <= maxVisible) {
    // 直接顯示全部頁數
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    // 以當前頁置中顯示 maxVisible 頁
    let start = Math.max(1, current - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;

    if (end > total) {
      end = total;
      start = total - maxVisible + 1;
    }

    for (let i = start; i <= end; i++) pages.push(i);
  }

  return pages;
});

// 跳轉
const goToPage = () => {
  const target = Math.max(1, Math.min(jumpPage.value, totalPages.value));
  emit("page-change", target);
};
</script>

<template>
  <nav>
    <ul class="pagination justify-content-center">
      <li class="page-item" :class="{ disabled: currentPage === 1 }">
        <a class="page-link" @click="emit('page-change', (currentPage = 1))">
          第一頁
        </a>
      </li>
      <li>
        <a class="page-link" @click="emit('page-change', currentPage - 1)">
          上一頁
        </a>
      </li>

      <li
        v-for="page in pageNumbers"
        :key="page"
        class="page-item"
        :class="{ active: currentPage === page }"
      >
        <a class="page-link" @click="emit('page-change', page)">{{ page }}</a>
      </li>

      <li class="page-item" :class="{ disabled: currentPage === totalPages }">
        <a class="page-link" @click="emit('page-change', currentPage + 1)">
          下一頁
        </a>
      </li>
      <li>
        <a
          class="page-link"
          @click="emit('page-change', (currentPage = totalPages))"
        >
          最後一頁
        </a>
      </li>
    </ul>

    <!-- 跳轉輸入框 -->
    <div class="d-flex justify-content-center mt-2">
      <input
        type="number"
        class="form-control w-auto"
        v-model.number="jumpPage"
        :min="1"
        :max="totalPages"
        @keyup.enter="goToPage"
      />
      <button class="btn btn-jump ms-2" @click="goToPage">跳轉</button>
    </div>
  </nav>
</template>

<style scoped>
.pagination:hover {
  cursor: pointer;
}

.btn-jump {
  background-color: #475fd9;
  color: white;
  border: none;
}

.btn-jump:hover {
  background-color: #0c6396;
}
</style>
