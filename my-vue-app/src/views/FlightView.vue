<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Navbar from "../components/NavBar.vue";
import Sidebar from "../components/Sidebar.vue";
import FilterBar from "../components/FilterBar.vue";
import DataTable from "../components/DataTable.vue";
import Pagination from "../components/Pagination.vue";
import EditModal from "../components/EditModal.vue";

// 狀態
const flights = ref([]);
const pagination = ref({
  page: 1,
  totalPages: 1,
  perPage: 10,
  totalItems: 0,
});
const filters = ref({});
const showModal = ref(false);
const modalMode = ref("create");
const selectedFlight = ref({});

// 篩選欄位
const filterFields = [
  {
    key: "flight_no",
    label: "航班號",
    type: "text",
    placeholder: "請輸入航班號",
  },
  { key: "from_airport", label: "出發機場", type: "select", options: [] },
  { key: "to_airport", label: "到達機場", type: "select", options: [] },
];

// 編輯欄位
const editFields = [
  { key: "id", label: "ID", type: "text", readonly: true },
  { key: "flight_no", label: "航班號", type: "text" },
  { key: "from_airport", label: "出發機場", type: "text" },
  { key: "to_airport", label: "到達機場", type: "text" },
  { key: "departure_time", label: "起飛時間", type: "datetime-local" },
  { key: "arrival_time", label: "到達時間", type: "datetime-local" },
];

// 取得資料
async function fetchFlights() {
  const res = await axios.post("/flight/admin/api/flight.php", {
    action: "list",
    page: pagination.value.page,
    perPage: pagination.value.perPage || 10,
    ...filters.value,
  });
  flights.value = res.data.data;
  pagination.value.totalItems = res.data.total;
}

// 編輯
function handleEdit(flight) {
  selectedFlight.value = { ...flight };
  modalMode.value = "edit";
  showModal.value = true;
}

// 新增
function handleAdd() {
  selectedFlight.value = {};
  modalMode.value = "create";
  showModal.value = true;
}

// 提交表單
async function handleSubmit(data) {
  const action = modalMode.value === "edit" ? "update" : "create";
  await axios.post("/flight/admin/api/flight.php", {
    action,
    ...data,
  });
  showModal.value = false;
  fetchFlights();
}

// 刪除
async function handleDelete(id) {
  if (!confirm("確認刪除？")) return;
  await axios.post("/flight/admin/api/flight.php", {
    action: "delete",
    id,
  });
  fetchFlights();
}

// 分頁切換
function changePage(page) {
  pagination.value.page = page;
  fetchFlights();
}

onMounted(fetchFlights);
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
          @filter="fetchFlights"
        />
        <button class="btn btn-success mb-3" @click="handleAdd">＋ 新增</button>

        <DataTable
          :columns="[
            'id',
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
          :onDelete="handleDelete"
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
      </div>
    </div>
  </div>
</template>
