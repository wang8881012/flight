<!-- 以 Sidebar.vue 為例 -->
<template>
  <div class="d-none d-md-block">
    <ul class="nav flex-column">
      <li class="nav-item">
        <router-link class="nav-link" to="/dashboard">
          <i class="bi bi-speedometer2 me-2"></i>Dashboard
        </router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link" to="/flight">
          <i class="bi bi-airplane me-2"></i>航班管理
        </router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link" to="/flight-classes">
          <i class="bi bi-currency-dollar me-2"></i>艙等票價管理
        </router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link" to="/flight-seats">
          <i class="bi bi-grid-3x3-gap me-2"></i>座位配置管理
        </router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link" to="/order">
          <i class="bi bi-receipt me-2"></i>訂單管理
        </router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link" to="/users">
          <i class="bi bi-people me-2"></i>會員管理
        </router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link" to="/payments">
          <i class="bi bi-cash-coin me-2"></i>金流紀錄查詢
        </router-link>
      </li>
    </ul>
  </div>
</template>
<script></script>
<style scoped></style>
