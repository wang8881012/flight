<template>
  <div class="modal fade show d-block" tabindex="-1" v-if="modelValue">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <form @submit.prevent="handleSubmit">
          <div class="modal-header">
            <h5 class="modal-title">編輯資料</h5>
            <button type="button" class="btn-close" @click="close"></button>
          </div>
          <div class="modal-body row g-3">
            <!-- 可擴充欄位 -->
            <div v-for="field in fields" :key="field.key" class="col-md-6">
              <label class="form-label">{{ field.label }}</label>
              <input
                v-if="field.type === 'text'"
                type="text"
                class="form-control"
                v-model="form[field.key]"
              />
              <input
                v-else-if="field.type === 'date'"
                type="date"
                class="form-control"
                v-model="form[field.key]"
              />
              <select
                v-else-if="field.type === 'select'"
                class="form-select"
                v-model="form[field.key]"
              >
                <option
                  v-for="option in field.options"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="close">
              取消
            </button>
            <button type="submit" class="btn btn-primary">儲存</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from "vue";

const props = defineProps({
  modelValue: Boolean,
  formData: Object,
  fields: Array,
});
const emit = defineEmits(["update:modelValue", "submit"]);

const form = reactive({});

// 複製傳入的資料到 local form（編輯時不會直接修改原物件）
watch(
  () => props.formData,
  (newData) => {
    Object.assign(form, newData || {});
  },
  { immediate: true }
);

const handleSubmit = () => {
  emit("submit", { ...form });
  emit("update:modelValue", false);
};

const close = () => {
  emit("update:modelValue", false);
};
</script>
