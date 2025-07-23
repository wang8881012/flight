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
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

onMounted(() => {
  const token = localStorage.getItem("adminToken");
  if (!token) {
    alert("請先登入");
    router.push("/");
  }
});

//預設modal模式為新增
const modalMode = ref("create");
const showModal = ref(false);
const selectedOrder = ref({});

// 篩選欄位
const filterFields = [
  {
    key: "order_no",
    label: "訂單編號",
    type: "text",
    placeholder: "請輸入訂單編號",
  },
  {
    key: "user_name",
    label: "會員姓名",
    type: "text",
    placeholder: "請輸入姓名",
  },
  {
    key: "status",
    label: "訂單狀態",
    type: "select",
    options: ["success", "fail", "pending"],
  },
];

//編輯欄位
const editFields = [
  { key: "order_no", label: "訂單編號", type: "text" },
  { key: "user_name", label: "會員姓名", type: "text" },
  {
    key: "status",
    label: "訂單狀態",
    type: "select",
    options: [
      {
        value: "success",
        label: "success",
      },
      {
        value: "fail",
        label: "fail",
      },
      {
        value: "pending",
        label: "pending",
      },
    ],
  },
];

//  CRUD composable
const {
  items: orders,
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
} = useCrud("/flight/admin/api/orders.php");

function handleEdit(order) {
  selectedOrder.value = { ...order };
  modalMode.value = "edit";
  showModal.value = true;
}

function handleAdd() {
  selectedOrder.value = {};
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
        <h2 class="mb-4">訂單管理</h2>

        <FilterBar
          :fields="filterFields"
          v-model="filters"
          @filter="
            (newFilters) => {
              Object.assign(filters, newFilters);
              pagination.page = 1;
              fetchItems();
            }
          "
        />
        <button class="btn btn-success mb-3" @click="handleAdd">＋ 新增</button>
        <DataTable
          :columns="[
            'order_no',
            'user_name',
            'from_airport',
            'to_airport',
            'total_price',
            'status',
            'created_at',
          ]"
          :rows="orders"
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
          :formData="selectedOrder"
          @submit="handleSubmit"
        />
        <ConfirmDeleteModal
          v-if="showDeleteModal"
          @close="showDeleteModal = false"
          @confirm="confirmDelete"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
