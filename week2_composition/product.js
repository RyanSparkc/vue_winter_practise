console.log('product.js');
// # 使用 vue3 composition 來撰寫產品列表
import { createApp, ref, onMounted, } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import { apiUrl, apiPath } from '../js/config.js';

const app = createApp({
  setup() {
    // 產品資料格式
    const products = ref([]);
    const tempProduct = ref({
      imagesUrl: [],
    });

    const checkLogin = () => {
      axios
        .post(`${apiUrl}/api/user/check`)
        .then((res) => {
          if (res.data.success) {
            getProducts();
          }
          // console.log(res.data);
        })
        .catch((err) => {
          alert(err.data.message);
          window.location = 'login.html';
        });
    };
    const getProducts = () => {
      axios
        .get(`${apiUrl}/api/${apiPath}/admin/products`)
        .then((res) => {
          // console.log(res.data);
          products.value = res.data.products;
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    };
    // 選取產品顯示詳細資料
    const openProduct = (item) => {
      tempProduct.value = item;
      // console.log('tempProduct', this.tempProduct);
    };

    onMounted(() => {
      // 取得 cookie
      const token = document.cookie.replace( /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, '$1' );
      // 將 token 加入到 headers
      axios.defaults.headers.common.Authorization = token;
      checkLogin();
    });

    return {
      products,
      tempProduct,
      openProduct,
    }
  }
});

app.mount('#app');
