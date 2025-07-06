<script setup>
defineProps({
  columns: Array,
  rows: Array,
  onEdit: Function,
  onDelete: Function,
});
</script>

<template>
  <table class="table table-bordered">
    <thead>
      <tr>
        <th v-for="col in columns" :key="col">{{ col }}</th>
        <th>操作</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, index) in rows" :key="index">
        <td v-for="col in columns" :key="col">{{ row[col] }}</td>
        <td>
          <button class="btn btn-sm btn-warning" @click="onEdit(row)">
            編輯
          </button>
          <button class="btn btn-sm btn-danger" @click="onDelete(row.id)">
            刪除
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>
