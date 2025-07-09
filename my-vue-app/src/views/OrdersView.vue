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

        <FiterBar />
        <button class="btn btn-success mb-3" @click="handleAdd">＋ 新增</button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
