<script setup>
import { ref } from "vue";
import Navbar from "../components/NavBar.vue";
import Sidebar from "../components/Sidebar.vue";
import FilterBar from "../components/FilterBar.vue";
import DataTable from "../components/DataTable.vue";
import Pagination from "../components/Pagination.vue";
import EditModal from "../components/EditModal.vue";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal.vue";

import { useCrud } from "../composables/useCrud";

const modalMode = ref("create");
const showModal = ref(false);
const selectedUser = ref({});

const filterFields = [
  { key: "name", label: "會員姓名", type: "text", placeholder: "請輸入姓名" },
  { key: "email", label: "Email", type: "text" },
];

const editFields = [
  { key: "id", label: "ID", type: "text", readonly: true },
  { key: "name", label: "姓名", type: "text" },
  { key: "email", label: "Email", type: "text" },
  { key: "birthday", label: "生日", type: "date" },
];

// ⬇️ 使用 CRUD composable
const {
  items: users,
  filters,
  pagination,
  loading,
  error,
  createItem,
  updateItem,
  changePage,
  openDeleteModal,
  confirmDelete,
  showDeleteModal,
  deleteTarget,
  canDelete,
  fetchItems,
} = useCrud("/flight/admin/api/users.php");

function handleEdit(user) {
  selectedUser.value = { ...user };
  modalMode.value = "edit";
  showModal.value = true;
}

function handleAdd() {
  selectedUser.value = {};
  modalMode.value = "create";
  showModal.value = true;
}

function handleSubmit(data) {
  if (modalMode.value === "create") {
    createItem(data).then(() => (showModal.value = false));
  } else {
    updateItem(data).then(() => (showModal.value = false));
  }
}
</script>

<template>
  <Navbar />
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-2 d-none d-md-block p-0 sidebar">
        <Sidebar />
      </div>
      <div class="col-12 col-md-10 main-content">
        <h2 class="mb-4">會員管理</h2>

        <FilterBar
          :fields="filterFields"
          v-model="filters"
          @filter="
            (val) => {
              filters.value = val;
              fetchItems();
            }
          "
        />

        <button class="btn btn-success mb-3" @click="handleAdd">＋ 新增</button>

        <DataTable
          :columns="['id', 'name', 'email', 'birthday', 'created_at']"
          :rows="users"
          :onEdit="handleEdit"
          :onDelete="openDeleteModal"
        />

        <Pagination
          :currentPage="pagination.page"
          :totalItems="pagination.totalItems"
          :perPage="pagination.perPage"
          @page-change="changePage"
        />

        <EditModal
          :fields="editFields"
          v-model="showModal"
          :mode="modalMode"
          :formData="selectedUser"
          @submit="handleSubmit"
        />

        <ConfirmDeleteModal
          v-if="showDeleteModal"
          :canDelete="canDelete"
          @close="showDeleteModal = false"
          @confirm="confirmDelete"
        />
      </div>
    </div>
  </div>
</template>
