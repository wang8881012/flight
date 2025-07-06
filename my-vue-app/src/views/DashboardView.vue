<script setup>
import { onMounted } from "vue";
import axios from "axios";
import Navbar from "../components/NavBar.vue";
import Sidebar from "../components/Sidebar.vue";

onMounted(async () => {
  const res = await axios.get("/flight/admin/api/dashboard.php");
  const data = res.data;

  //本週訂單數
  document.getElementById("weeklyOrders").innerText = data.weekly_orders;
  //本週營收
  document.getElementById(
    "weeklyAve"
  ).innerText = `${data.weekly_revenue.toLocaleString()}`;
  //會員數
  document.getElementById("memberCount").innerText =
    data.member_count.toLocaleString();

  //每週訂單數(折線圖)
  const ctx1 = document.getElementById("ordersChart").getContext("2d");
  new Chart(ctx1, {
    type: "line",
    data: {
      labels: data.orders.map((d) => d.month),
      datasets: [
        {
          label: "每月訂單數",
          data: data.orders.map((d) => d.orders),
          backgroundColor: "#13678A",
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0, // 不顯示小數
          },
        },
      },
    },
  });

  //熱門航線排行(長條圖）
  const ctx2 = document.getElementById("routeChart").getContext("2d");
  new Chart(ctx2, {
    type: "bar",
    data: {
      labels: data.top_destinations.map((d) => d.destination),
      datasets: [
        {
          label: "熱門航線排行",
          data: data.top_destinations.map((d) => d.total_bookings),
          backgroundColor: ["#DAFDBA", "#45C4B0"],
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0, // 不顯示小數
          },
        },
      },
    },
  });
  //艙等訂票分布(圓餅圖)
  const ctx3 = document.getElementById("classChart").getContext("2d");
  new Chart(ctx3, {
    type: "pie",
    data: {
      labels: data.class_distribution.map((d) => d.class_type),
      datasets: [
        {
          label: "艙等訂票分布",
          data: data.class_distribution.map((d) => d.total_bookings),
          backgroundColor: ["#EFDFCC", "#D7A184"],
        },
      ],
    },
  });

  //營收趨勢圖(折線圖)
  const ctx4 = document.getElementById("saleChart").getContext("2d");
  new Chart(ctx4, {
    type: "line",
    data: {
      labels: data.sales.map((d) => d.month),
      datasets: [
        {
          label: "營收趨勢",
          data: data.sales.map((d) => d.revenue),
          backgroundColor: "#F2C94C",
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0, // 不顯示小數
          },
        },
      },
    },
  });
});
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
        <h2 class="mb-4">儀表板</h2>
        <div class="row">
          <div class="col-md-4 mb-3">
            <div class="card card-custom p-3">
              <h5>本週訂單</h5>
              <p class="fs-3 text-success mx-auto" id="weeklyOrders">128</p>
            </div>
          </div>
          <div class="col-md-4 mb-3">
            <div class="card card-custom p-3">
              <h5>本週營收</h5>
              <p class="fs-3 text-primary mx-auto" id="weeklyAve">10</p>
            </div>
          </div>
          <div class="col-md-4 mb-3">
            <div class="card card-custom p-3">
              <h5>會員數</h5>
              <p class="fs-3 text-warning mx-auto" id="memberCount">11,283</p>
            </div>
          </div>
        </div>
        <div class="row my-5">
          <!-- 每週訂單數(折線圖) -->
          <div class="col-md-6">
            <div class="card card-custom p-3">
              <h5 class="text-center mb-4">每月訂單數</h5>
              <div class="canvas-container">
                <canvas id="ordersChart"></canvas>
              </div>
            </div>
          </div>
          <!-- 熱門航線排行(長條圖) -->
          <div class="col-md-6">
            <div class="card card-custom p-3">
              <h5 class="text-center mb-4">熱門航線排行</h5>
              <div class="canvas-container">
                <canvas id="routeChart"></canvas>
              </div>
            </div>
          </div>
        </div>
        <div class="row my-5">
          <!-- 艙等訂票分布(圓餅圖) -->
          <div class="col-12 col-md-6">
            <div class="card card-custom p-3">
              <h5 class="text-center mb-4">艙等訂票分布</h5>
              <div class="canvas-container">
                <canvas id="classChart" class="chart-fixed"></canvas>
              </div>
            </div>
          </div>
          <!-- 營收趨勢圖(折線圖) -->
          <div class="col-md-6">
            <div class="card card-custom p-3">
              <h5 class="text-center mb-4">營收趨勢</h5>
              <div class="canvas-container">
                <canvas id="saleChart"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
