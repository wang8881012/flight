<template>
  <form class="row g-3 mb-3" @submit.prevent="submit">
    <div v-for="field in fields" :key="field.key" class="col-md-2">
      <label class="form-label">{{ field.label }}</label>

      <!-- 文字欄位 -->
      <input
        v-if="field.type === 'text'"
        type="text"
        class="form-control"
        v-model="form[field.key]"
        :placeholder="field.placeholder || ''"
      />

      <!-- 下拉選單 -->
      <select
        v-else-if="field.type === 'select'"
        class="form-select"
        v-model="form[field.key]"
      >
        <option value="">全部</option>
        <option
          v-for="option in field.options"
          :key="option.value ?? option"
          :value="option.value ?? option"
        >
          {{ option.label ?? option }}
        </option>
      </select>

      <!-- 日期欄位 -->
      <input
        v-else-if="field.type === 'date'"
        type="date"
        class="form-control"
        v-model="form[field.key]"
      />
    </div>

    <div
      class="col-md-2 offset-md-2 d-flex justify-content-end align-items-end"
    >
      <button class="btn w-50" @click="submitFilters" type="button">
        篩選
      </button>
    </div>
    <div class="col-md-2 d-flex align-items-end">
      <button class="btn" @click="resetFilters" type="button">清除篩選</button>
    </div>
  </form>
</template>

<script setup>
import { reactive, watchEffect } from "vue";

const props = defineProps({
  fields: Array,
  modelValue: Object, // 可支援 v-model 用法
});
const emit = defineEmits(["update:modelValue", "filter"]);

const form = reactive({});

// 初始化欄位值（for v-model）
// watchEffect(() => {
//   if (props.modelValue) {
//     Object.assign(form, props.modelValue); // 賦予新值
//   }
// });

const submitFilters = () => {
  const cleaned = {};

  for (const key in form) {
    const val = form[key];
    if (typeof val === "string") {
      const trimmed = val.trim();
      if (trimmed !== "") cleaned[key] = trimmed;
    } else if (val !== null && val !== undefined && val !== "") {
      cleaned[key] = val;
    }
  }

  emit("filter", cleaned);
};

const resetFilters = () => {
  for (const key in form) {
    form[key] = "";
  }
  const newFilters = {};
  emit("update:modelValue", newFilters);
  emit("filter", newFilters);
};
</script>
<style scoped>
.btn {
  background-color: #91cfd9;
}

.btn:hover {
  background-color: #8aafac;
}
</style>
