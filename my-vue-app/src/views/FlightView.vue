<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Navbar from "../components/NavBar.vue";
import Sidebar from "../components/Sidebar.vue";
import FilterBar from "../components/FilterBar.vue";
import DataTable from "../components/DataTable.vue";
import Pagination from "../components/Pagination.vue";
import EditModal from "../components/EditModal.vue";

const flights = ref([]);
const pagination = ref({ page: 1, totalPages: 1 });
const filters = ref({});
const showModal = ref(false);
const selectedUser = ref({});

const fetchFlights = async () => {
  const res = await axios.post("/flight/admin/api/flight.php", {
    action: "list",
    page: pagination.page,
    per_page: pagination.per_page,
    keyword: filter.keyword,
  });
  flights.value = res.data.data;
  pagination.total_pages = res.data.pagination.total_pages;
};

const changePage = (newPage) => {
  pagination.page = newPage;
  fetchFlights();
};

const openModal = (item) => {
  Object.assign(form, item || {});
  showModal.value = true;
};

const submitForm = async () => {
  const action = form.id ? "update" : "create";
  await axios.post("/flight/admin/api/flight.php", {
    action,
    form: { ...form },
  });
  showModal.value = false;
  fetchFlights();
};

const deleteFlight = async (item) => {
  if (!confirm("確認刪除？")) return;
  await axios.post("/flight/admin/api/flight.php", {
    action: "delete",
    id: item.id,
  });
  fetchFlights();
};

onMounted(fetchFlights);
</script>

<template>
  <Navbar />
  <div class="container-fluid">
    <div class="row">
      <!-- Sidebar -->
      <div class="col-md-2 d-none d-md-block p-0 sidebar">
        <Sidebar />
      </div>
      <!-- Main Content -->
      <div class="col-12 col-md-10 main-content">
        <h2 class="mb-4">航班管理</h2>
        <!-- 篩選器 -->
        <div class="row mb-3">
          <div class="col-md-3 mb-4">
            <FilterBar
              :keyword="filter.keyword"
              @update:keyword="filter.keyword = $event"
              @search="fetchFlights"
            />
          </div>
        </div>
        <!-- 新增按鈕 -->
        <div class="col-md-3 mb-4">
          <button class="btn btn-primary mb-3" @click="openModal(null)">
            新增航班
          </button>
        </div>
        <!-- 資料表格 -->
        <DataTable
          :items="flights"
          :fields="[
            'flight_no',
            'from_airport',
            'to_airport',
            'departure_time',
            'arrival_time',
          ]"
          @edit="openModal"
          @delete="deleteFlight"
        />

        <!-- 分頁 -->
        <Pagination
          :page="pagination.page"
          :total-pages="pagination.total_pages"
          @change="changePage"
        />

        <!-- 編輯/新增彈窗 -->
        <EditModal
          v-if="showModal"
          :form="form"
          :is-editing="!!form.id"
          @close="showModal = false"
          @submit="submitForm"
        />
      </div>
    </div>
  </div>
</template>
