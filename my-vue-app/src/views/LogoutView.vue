<script setup>
import { useRouter } from "vue-router";
const router = useRouter();

localStorage.removeItem("adminToken");
router.push("/");
</script>
