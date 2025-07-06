<template>
  <div class="login-bg min-vh-100 d-flex flex-column justify-content-center">
    <h3 class="text-center my-5">
      <i class="bi bi-airplane-fill"></i>歡迎來到AirGo後台
    </h3>
    <div class="container-fluid mb-5">
      <div class="row">
        <div class="col-12 col-md-6 offset-md-3">
          <div class="card card-custom">
            <div class="card-header text-center">登入系統</div>
            <div
              v-if="errorMessage"
              class="alert alert-danger alert-dismissible w-75 mx-auto mt-2"
              role="alert"
            >
              <span>{{ errorMessage }}</span>
              <button
                type="button"
                class="btn-close"
                @click="errorMessage = ''"
                aria-label="Close"
              ></button>
            </div>
            <div class="card-body">
              <form @submit.prevent="handleLogin">
                <div class="mb-3">
                  <label for="username" class="form-label">管理者名稱</label>
                  <input
                    type="text"
                    class="form-control"
                    id="username"
                    v-model="acc"
                    required
                  />
                </div>
                <div class="mb-3">
                  <label for="password" class="form-label">密碼</label>
                  <input
                    type="password"
                    class="form-control"
                    id="password"
                    v-model="pwd"
                    required
                  />
                </div>
                <button
                  type="submit"
                  class="btn btn-dark w-50 mx-auto d-block mt-4"
                >
                  登入
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const acc = ref("");
const pwd = ref("");
const errorMessage = ref("");
const router = useRouter();

const handleLogin = async () => {
  try {
    const res = await axios.post("/flight/admin/api/login.php", {
      acc: acc.value,
      pwd: pwd.value,
    });
    // 根據後端回傳決定是否導向
    if (res.data.success) {
      router.push("/dashboard");
    } else {
      errorMessage.value = res.data.message || "登入失敗";
    }
  } catch (e) {
    errorMessage.value = "登入失敗，請檢查帳號密碼";
  }
};
</script>

<style scoped>
.login-bg,
:global(html) {
  background: linear-gradient(135deg, #a1c4fd, #c2e9fb);
  min-height: 100vh;
  margin: 0;
  padding: 0;
}
.card-custom {
  border: none;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
  border-radius: 1rem;
}
</style>
