<template>
  <!-- <div class="d-flex">
    <Sidebar />
    <div class="flex-grow-1 p-4">
      <Navbar />-->
  <h2 class="mb-3">航班管理</h2>
  <!-- 
      <FilterBar :filters="filters" @filter="getFlights" />

      <button class="btn btn-primary mb-3" @click="openModal(null)">
        新增航班
      </button>

      <DataTable
        :columns="columns"
        :rows="rows"
        @edit="openModal"
        @delete="deleteFlight"
      />

      <Pagination :pagination="pagination" @page-change="changePage" />

      <EditModal
        v-if="showModal"
        :form="editForm"
        @save="saveFlight"
        @close="showModal = false"
      />
    </div>
  </div> -->
</template>

<script>
// import Sidebar from "@/components/Sidebar.vue";
// import Navbar from "@/components/Navbar.vue";
// import FilterBar from "@/components/FilterBar.vue";
// import DataTable from "@/components/DataTable.vue";
// import Pagination from "@/components/Pagination.vue";
// import EditModal from "@/components/EditModal.vue";
import axios from "axios";

// export default {
//   components: { Sidebar, Navbar, FilterBar, DataTable, Pagination, EditModal },
//   data() {
//     return {
//       filters: {
//         keyword: "",
//         status: "",
//       },
//       columns: [
//         { key: "flight_no", label: "航班編號" },
//         { key: "from_airport", label: "出發地" },
//         { key: "to_airport", label: "目的地" },
//         { key: "departure_time", label: "起飛時間" },
//         { key: "arrival_time", label: "抵達時間" },
//         { key: "actions", label: "操作" },
//       ],
//       rows: [],
//       pagination: {
//         page: 1,
//         per_page: 10,
//         total: 0,
//       },
//       showModal: false,
//       editForm: null,
//     };
//   },
//   mounted() {
//     this.getFlights();
//   },
//   methods: {
//     getFlights() {
//       axios
//         .post("../api/flights.php", {
//           action: "list",
//           ...this.filters,
//           page: this.pagination.page,
//           per_page: this.pagination.per_page,
//         })
//         .then((res) => {
//           this.rows = res.data.data;
//           this.pagination.total = res.data.pagination.total;
//         });
//     },
//     changePage(newPage) {
//       this.pagination.page = newPage;
//       this.getFlights();
//     },
//     openModal(row) {
//       this.editForm = row
//         ? { ...row }
//         : {
//             flight_no: "",
//             from_airport: "",
//             to_airport: "",
//             departure_time: "",
//             arrival_time: "",
//           };
//       this.showModal = true;
//     },
//     saveFlight(form) {
//       const action = form.id ? "update" : "create";
//       axios
//         .post("../api/flights.php", {
//           action,
//           ...form,
//         })
//         .then(() => {
//           this.showModal = false;
//           this.getFlights();
//         });
//     },
//     deleteFlight(id) {
//       if (confirm("確定要刪除這筆資料嗎？")) {
//         axios
//           .post("../api/flights.php", {
//             action: "delete",
//             id,
//           })
//           .then(() => {
//             this.getFlights();
//           });
//       }
//     },
//   },
// };
</script>

<style scoped></style>
