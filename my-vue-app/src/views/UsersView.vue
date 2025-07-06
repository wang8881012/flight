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

const filterFields = [
  { key: "name", label: "會員姓名", type: "text", placeholder: "請輸入姓名" },
  { key: "email", label: "Email", type: "text" },
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
  showModal.value = true;
}

function handleDelete(id) {
  axios
    .post("/flight/admin/api/users.php", { action: "delete", id })
    .then(fetchUsers);
}

function handleSubmit(data) {
  axios
    .post("/flight/admin/api/users.php", { action: "update", ...data })
    .then(fetchUsers);
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
          v-model="showModal"
          :formData="selectedUser"
          @submit="handleSubmit"
        />
      </div>
    </div>
  </div>
</template>
