<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <button class="navbar-toggler" type="button"
      data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <RouterLink class="nav-link" to="/admin/products">產品列表</RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink class="nav-link" to="">優惠券</RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink class="nav-link" to="/admin/order">訂單管理</RouterLink>
        </li>
      </ul>
      <div>
        <div class="nav-item">
          <RouterLink class="nav-link" to="/">回到前台</RouterLink>
        </div>
      </div>
    </div>
  </nav>

  <h2>這是後台</h2>
  <RouterView v-if="success === true"></RouterView>
</template>
<script>
import axios from 'axios';

const { VITE_APP_URL } = import.meta.env;

export default {
  data() {
    return {
      // 產品資料格式
      products: [],
      tempProduct: {
        imagesUrl: [],
      },
      success: false,
    };
  },
  methods: {
    checkLogin() {
      axios
        .post(`${VITE_APP_URL}/api/user/check`)
        .then(() => {
          this.success = true;
          // console.log(res.data.success);
        })
        .catch(() => {
          // alert(err.response.data.message);
          this.$router.push('/login');
        });
    },
  },
  mounted() {
    // 取得 cookie
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    // 將 token 加入到 headers
    axios.defaults.headers.common.Authorization = token;
    this.checkLogin();
  },
};
</script>
