// src/composables/useCrud.js
import { ref, onMounted } from "vue";
import axios from "axios";

export function useCrud(apiUrl, defaultFilters = {}, fetchOnMounted = true) {
  const items = ref([]);
  const filters = ref(defaultFilters);
  const loading = ref(false);
  const error = ref(null);

  const pagination = ref({
    page: 1,
    perPage: 10,
    totalPages: 1,
    totalItems: 0,
  });

  //  新增：刪除 modal 狀態控制
  const showDeleteModal = ref(false);
  const deleteTarget = ref(null);
  const canDelete = ref(true);

  //  決定是否能刪除（可自定條件）
  function checkDeletable(item) {
    // 範例條件：付款紀錄或已付款訂單不能刪
    return item.status !== "paid" && item.type !== "payment_record";
  }

  //  點擊刪除時：開啟 modal
  function openDeleteModal(item) {
    deleteTarget.value = item;
    // console.log("收到刪除項目：", item);
    canDelete.value = checkDeletable(item);
    showDeleteModal.value = true;
  }

  //  點確認後：執行刪除
  const confirmDelete = async () => {
    if (!deleteTarget.value || !canDelete.value) return;
    console.log("刪除 ID:", deleteTarget.value.id);
    loading.value = true;
    error.value = null;
    try {
      await axios.post(apiUrl, {
        action: "delete",
        id: deleteTarget.value.id,
      });
      await fetchItems();
    } catch (err) {
      error.value = err.message || "刪除失敗";
    } finally {
      loading.value = false;
      showDeleteModal.value = false;
    }
  };

  const fetchItems = async () => {
    loading.value = true;
    error.value = null;
    try {
      const res = await axios.post(apiUrl, {
        page: pagination.value.page,
        ...filters.value,
        action: "list",
      });
      items.value = res.data.data;
      pagination.value.totalItems = res.data.pagination.total;
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  const createItem = async (data) => {
    loading.value = true;
    error.value = null;
    try {
      await axios.post(apiUrl, { action: "create", ...data });
      await fetchItems();
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  const updateItem = async (data) => {
    loading.value = true;
    error.value = null;
    try {
      await axios.post(apiUrl, { action: "update", ...data });
      await fetchItems();
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  const changePage = (page) => {
    pagination.value.page = page;
    fetchItems();
  };

  if (fetchOnMounted) {
    onMounted(fetchItems);
  }

  return {
    // 基本資料
    items,
    filters,
    pagination,
    loading,
    error,

    // CRUD 方法
    fetchItems,
    createItem,
    updateItem,
    changePage,

    // 刪除相關
    showDeleteModal,
    deleteTarget,
    canDelete,
    openDeleteModal,
    confirmDelete,
  };
}
