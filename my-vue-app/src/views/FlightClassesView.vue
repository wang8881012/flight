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

const modalMode = ref("create");
const showModal = ref(false);
const selectedFlight_classes = ref({});

// 篩選欄位
const filterFields = [
  {
    key: "flight_no",
    label: "航班號",
    type: "text",
    placeholder: "請輸入航班號",
  },
  {
    key: "class_type",
    label: "艙等",
    type: "select",
    options: ["business", "economy"],
  },
  {
    key: "routes",
    label: "航線",
    type: "select",
    options: ["TPE-HND", "HND-TPE", "TPE-KIX", "KIX-TPE", "TPE-CTS", "CTS-TPE"],
  },
];

// 編輯欄位
const editFields = [
  { key: "flight_no", label: "航班號", type: "text" },
  {
    key: "class_type",
    label: "艙等",
    type: "select",
    options: [
      { value: "economy", label: "economy" },
      { value: "business", label: "business" },
    ],
  },
  { key: "routes", label: "航線", type: "text" },
  { key: "price", label: "價格", type: "text" },
  { key: "seats_available", label: "可用座位數", type: "text" },
];

// 詳細欄位
// const detailFields = ["flight_no", "routes", "class_type", "seats_available"];

// const detailLabels = {
//   flight_no: "航班號",
//   routes: "航線",
//   class_type: "艙等",
//   seats_available: "可用座位數",
// };
//  useCrud 統一管理
const {
  items: flight_classes,
  filters,
  pagination,
  loading,
  error,
  createItem,
  updateItem,
  changePage,
  fetchItems,
  showDeleteModal,
  deleteTarget,
  canDelete,
  openDeleteModal,
  confirmDelete,
} = useCrud("/flight/admin/api/flight_classes.php");

function handleEdit(flight_classes) {
  selectedFlight_classes.value = { ...flight_classes };
  modalMode.value = "edit";
  showModal.value = true;
}

function handleAdd() {
  selectedFlight_classes.value = {};
  modalMode.value = "create";
  showModal.value = true;
}

function handleSubmit(data) {
  const action = modalMode.value === "edit" ? updateItem : createItem;
  action(data).then(() => {
    showModal.value = false;
  });
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
        <h2 class="mb-4">艙等管理</h2>

        <FilterBar
          :fields="filterFields"
          v-model="filters"
          @filter="
            (newFilters) => {
              Object.assign(filters, newFilters);
              fetchItems();
            }
          "
        />

        <button class="btn btn-success mb-3" @click="handleAdd">＋ 新增</button>

        <DataTable
          :columns="[
            'flight_no',
            'routes',
            'class_type',
            'price',
            'seats_available',
          ]"
          :rows="flight_classes"
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
          :formData="selectedFlight_classes"
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

<style scoped></style>
