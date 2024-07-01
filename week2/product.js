console.log('product.js');
// # 使用 vue3 option 來撰寫產品列表

import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import { apiUrl, apiPath } from '../js/config.js';

const app = createApp({
  data() {
    return {
      // 產品資料格式
      products: [],
      tempProduct: {
        imagesUrl: [],
      },
    };
  },
  methods: {
    checkLogin() {
      axios
        .post(`${apiUrl}/api/user/check`)
        .then((res) => {
          // console.log(res.data);
          if(res.data.success){
            this.getProducts();
          }
        })
        .catch((err) => {
          alert(err.response.data.message);
          window.location = 'login.html';
        });
    },
    getProducts() {
      axios
        .get(`${apiUrl}/api/${apiPath}/admin/products`)
        .then((res) => {
          console.log(res.data);
          this.products = res.data.products;
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    // 選取產品顯示詳細資料
    openProduct(item) {
      this.tempProduct = item;
      // console.log('tempProduct', this.tempProduct);
    },
  },
  mounted() {
    // 取得 cookie
    const token = document.cookie.replace( /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, '$1' );
    // 將 token 加入到 headers
    axios.defaults.headers.common.Authorization = token;
    this.checkLogin();
  },
});

app.mount('#app');
