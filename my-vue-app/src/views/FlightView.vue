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
    router.push("/login");
  }
});

const modalMode = ref("create");
const showModal = ref(false);
const selectedFlight = ref({});

// 篩選欄位
const filterFields = [
  {
    key: "flight_no",
    label: "航班號",
    type: "text",
    placeholder: "請輸入航班號",
  },
  {
    key: "from_airport",
    label: "出發機場",
    type: "select",
    options: ["TPE", "KIX", "HND", "CTS"],
  },
  {
    key: "to_airport",
    label: "到達機場",
    type: "select",
    options: ["TPE", "KIX", "HND", "CTS"],
  },
];

// 編輯欄位
const editFields = [
  { key: "flight_no", label: "航班號", type: "text" },
  { key: "from_airport", label: "出發機場", type: "text" },
  { key: "to_airport", label: "到達機場", type: "text" },
  { key: "departure_time", label: "起飛時間", type: "date" },
  { key: "arrival_time", label: "到達時間", type: "date" },
];

//  useCrud 統一管理
const {
  items: flights,
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
} = useCrud("/flight/admin/api/flight.php");

function handleEdit(flight) {
  selectedFlight.value = { ...flight };
  modalMode.value = "edit";
  showModal.value = true;
}

function handleAdd() {
  selectedFlight.value = {};
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
        <h2 class="mb-4">航班管理</h2>

        <FilterBar
          :fields="filterFields"
          v-model="filters"
          @filter="fetchItems"
        />

        <button class="btn btn-success mb-3" @click="handleAdd">＋ 新增</button>

        <DataTable
          :columns="[
            'flight_no',
            'from_airport',
            'to_airport',
            'departure_time',
            'arrival_time',
            'duration',
            'direction',
          ]"
          :rows="flights"
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
          :formData="selectedFlight"
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
