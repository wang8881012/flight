<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Navbar from "../components/NavBar.vue";
import Sidebar from "../components/Sidebar.vue";
import FilterBar from "../components/FilterBar.vue";
import DataTable from "../components/DataTable.vue";
import Pagination from "../components/Pagination.vue";
import EditModal from "../components/EditModal.vue";

const users = ref([]);
const pagination = ref({ page: 1, totalPages: 1 });
const filters = ref({});
const modalMode = ref("create");

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

const showModal = ref(false);
const selectedUser = ref({});

function fetchUsers() {
  axios
    .post("/flight/admin/api/users.php", {
      page: pagination.value.page,
      ...filters.value,
      action: "list",
    })
    .then((res) => {
      users.value = res.data.data;
      pagination.value.totalPages = res.data.pagination.total_pages;
    });
}

function handleEdit(user) {
  selectedUser.value = { ...user };
  modalMode.value = "edit";
  showModal.value = true;
}

function handleDelete(id) {
  axios
    .post("/flight/admin/api/users.php", { action: "delete", id })
    .then(fetchUsers);
}

function handleSubmit(data) {
  if (modalMode.value === "create") {
    // 新增
    axios
      .post("/flight/admin/api/users.php", { action: "create", ...data })
      .then(() => {
        fetchUsers();
        showModal.value = false;
      });
  } else if (modalMode.value === "edit") {
    // 編輯
    axios
      .post("/flight/admin/api/users.php", { action: "update", ...data })
      .then(() => {
        fetchUsers();
        showModal.value = false;
      });
  }
}

function handleAdd() {
  selectedUser.value = {}; // 清空
  modalMode.value = "create";
  showModal.value = true;
}

onMounted(fetchUsers);
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
              fetchUsers();
            }
          "
        />
        <button class="btn btn-success" @click="handleAdd">＋ 新增</button>

        <DataTable
          :columns="['id', 'name', 'email', 'birthday', 'created_at']"
          :rows="users"
          :onEdit="handleEdit"
          :onDelete="handleDelete"
        />

        <Pagination
          :currentPage="pagination.page"
          :totalPages="pagination.totalPages"
          @page-change="
            (page) => {
              pagination.page = page;
              fetchUsers();
            }
          "
        />

        <EditModal
          :fields="editFields"
          v-model="showModal"
          :mode="modalMode"
          :formData="selectedUser"
          @submit="handleSubmit"
        />
      </div>
    </div>
  </div>
</template>
