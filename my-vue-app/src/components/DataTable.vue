<script setup>
defineProps({
  columns: Array,
  rows: Array,
  onEdit: Function,
  onDelete: Function,
});
</script>

<template>
  <div class="table-responsive">
    <table class="table text-center align-middle">
      <thead>
        <tr class="table-primary">
          <th v-for="col in columns" :key="col">{{ col }}</th>
          <th>查看</th>
          <th v-if="onEdit || onDelete">操作</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(row, index) in rows" :key="index">
          <!-- 主列 -->
          <tr>
            <td v-for="col in columns" :key="col">{{ row[col] }}</td>
            <td>
              <button
                class="btn btn-sm btn-more"
                data-bs-toggle="collapse"
                :data-bs-target="'#details-' + index"
                aria-expanded="false"
                :aria-controls="'details-' + index"
              >
                查看更多
              </button>
            </td>
            <td v-if="onEdit || onDelete">
              <button class="btn btn-sm btn-edit mx-1" @click="onEdit(row)">
                編輯
              </button>
              <button class="btn btn-sm btn-delete mx-1" @click="onDelete(row)">
                刪除
              </button>
            </td>
          </tr>

          <!-- 詳細列（收合） -->
          <tr :id="'details-' + index" class="collapse bg-light">
            <td colspan="100%">
              <div class="text-start p-3">
                <strong>詳細資料：</strong><br />
                <div v-for="(value, key) in row" :key="key">
                  {{ key }}: {{ value }}
                </div>
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>
<style scoped>
.btn-more {
  background-color: #cdd9a3;
  color: #333;
}

.btn-more:hover {
  background-color: #acbc6c;
  color: #333;
}
.collapse {
  transition: all 0.3s ease;
}
</style>
