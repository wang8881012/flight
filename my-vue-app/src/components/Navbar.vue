<template>
  <nav class="navbar navbar-dark bg-dark px-3">
    <button
      class="btn btn-outline-light d-md-none"
      type="button"
      data-bs-toggle="offcanvas"
      data-bs-target="#sidebarOffcanvas"
    >
      ☰
    </button>
    <router-link class="navbar-brand ms-2" to="/dashboard"
      >AirGo後台</router-link
    >
    <span class="navbar-text ms-auto text-white">admin</span>
    <router-link class="mx-3 text-white nav-link" to="/">登出</router-link>
  </nav>

  <!-- Offcanvas Sidebar for mobile -->
  <div
    class="offcanvas offcanvas-start d-md-none w-75 sidebar"
    tabindex="-1"
    id="sidebarOffcanvas"
  >
    <div class="offcanvas-header">
      <h5 class="offcanvas-title">選單</h5>
      <button
        type="button"
        class="btn-close text-reset"
        data-bs-dismiss="offcanvas"
      ></button>
    </div>
    <div class="offcanvas-body">
      <ul class="nav flex-column">
        <li class="nav-item">
          <router-link class="nav-link" to="/dashboard"
            ><i class="bi bi-speedometer2 me-2"></i>Dashboard</router-link
          >
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/flight"
            ><i class="bi bi-airplane me-2"></i>航班管理</router-link
          >
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/flight-classes"
            ><i class="bi bi-currency-dollar me-2"></i>艙等票價管理</router-link
          >
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/flight-seats"
            ><i class="bi bi-grid-3x3-gap me-2"></i>座位配置管理</router-link
          >
        </li>

        <li class="nav-item">
          <router-link class="nav-link" to="/order"
            ><i class="bi bi-receipt me-2"></i>訂單管理</router-link
          >
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/users"
            ><i class="bi bi-people me-2"></i>會員管理</router-link
          >
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/payments"
            ><i class="bi bi-cash-coin me-2"></i>金流紀錄查詢</router-link
          >
        </li>
      </ul>
    </div>
  </div>
</template>
<script></script>
<style scoped></style>
