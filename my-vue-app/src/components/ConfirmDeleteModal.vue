<template>
  <div class="modal fade show d-block" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div
          class="modal-header"
          :class="
            canDelete ? 'bg-danger text-white' : 'bg-secondary text-white'
          "
        >
          <h5 class="modal-title">
            {{ canDelete ? "確認刪除" : "無法刪除" }}
          </h5>
          <button
            type="button"
            class="btn-close"
            @click="$emit('close')"
          ></button>
        </div>
        <div class="modal-body">
          <p v-if="canDelete">你確定要刪除這筆資料嗎？此動作無法復原。</p>
          <p v-else>此資料無法被刪除(訂單或歷史金流記錄)</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="$emit('close')">
            返回
          </button>
          <button
            class="btn btn-danger"
            v-if="canDelete"
            @click="$emit('confirm')"
          >
            確認刪除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  canDelete: Boolean,
});
</script>
<style scoped>
.modal {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
