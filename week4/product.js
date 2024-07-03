console.log('product.js');
// # 使用 vue3 option 來撰寫產品列表

// 1. 驗證登入 `${apiUrl}/api/user/check`
// 2. 取得產品列表 `${apiUrl}/api/${apiPath}/admin/products/all`
// 3. 新增產品 `${apiUrl}/api/${apiPath}/admin/product`
// 4. 刪除、編輯產品 `${apiUrl}/api/${apiPath}/admin/product/${this.tempProduct.id}`


import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import { apiUrl, apiPath } from '../js/config.js';

// let productModal = null;
// let delProductModal = null;

const app = createApp({
  data() {
    return {
      // 產品資料格式
      products: [],
      isNew: false,
      tempProduct: {
        imagesUrl: [],
      },
      pagination: {},
    };
  },
  mounted() {
    // 取得 cookie
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
      '$1'
    );
    // 將 token 加入到 headers
    axios.defaults.headers.common.Authorization = token;
    this.checkLogin();
  },
  methods: {
    checkLogin() {
      axios
        .post(`${apiUrl}/api/user/check`)
        .then((res) => {
          // console.log(res.data);
          if (res.data.success) {
            this.getProducts();
          }
        })
        .catch((err) => {
          alert(err.response.data.message);
          window.location = 'login.html';
        });
    },
    getProducts(page = 1) {
      axios
        .get(`${apiUrl}/api/${apiPath}/admin/products?page=${page}`)
        .then((res) => {
          console.log(res.data);
          // this.products = res.data.products;
          const { products, pagination } = res.data;
          this.products = products;
          this.pagination = pagination;
      })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    openModal(status, item) {
      if (status === 'new') {
        this.tempProduct = {
          imagesUrl: [],
        };
        this.isNew = true;
        console.log('new', this.tempProduct);
        this.$refs.productModal.openModal();
      } else if (status === 'edit') {
        this.tempProduct = { ...item };
        this.isNew = false;
        // console.log('editTemp', this.tempProduct);
        this.$refs.productModal.openModal();
      } else if (status === 'delete') {
        this.tempProduct = { ...item };
        // console.log('delTemp', this.tempProduct);
        this.$refs.delProductModal.openModal();
      }
    },
  },
});

// 分頁元件
app.component('pagination', {
  // 定義元件的模板、數據和方法
  template: '#pagination',
  emits: ['emit-change-pages'],
  props: ['pages'],
  methods: {
    emitPages(item) {
      this.$emit('emit-change-pages', item);
    },
  },
});

// 產品模態框元件
app.component('product-modal', {
  // 定義元件的模板、數據和方法
  data() {
    return {
      productModal: null,
    };
  },
  template: '#productModal',
  props: ['tempProduct', 'isNew'],
  emits: ['update'],
  mounted() {
    // openModal
    this.productModal = new bootstrap.Modal(
      document.getElementById('productModal'),
      {
        keyboard: false,
        backdrop: 'static',
      }
    );
  },
  methods: {
    updateProduct() {
      let url = `${apiUrl}/api/${apiPath}/admin/product/${this.tempProduct.id}`;
      let http = 'put';

      if (this.isNew) {
        url = `${apiUrl}/api/${apiPath}/admin/product`;
        http = 'post';
      }
      axios[http](url, { data: this.tempProduct })
        .then((res) => {
          // console.log(res.data);
          alert(res.data.message);
          this.closeModal();
          // this.getProducts();
          this.$emit('update');
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    createImages() {
      this.tempProduct.imagesUrl = [];
      this.tempProduct.imagesUrl.push('');
    },
    openModal() {
      this.productModal.show();
    },
    closeModal() {
      this.productModal.hide();
    },
  },
});

// 刪除產品模態框元件
app.component('del-product-modal', {
  data() {
    return {
      delProductModal: null,
    };
  },
  template: '#delProductModal',
  props: ['tempProduct'],
  emits: ['update'],
  mounted() {
    // delModal
    this.delProductModal = new bootstrap.Modal(
      document.getElementById('delProductModal'),
      {
        keyboard: false,
        backdrop: 'static',
      }
    );
  },
  methods: {
    deleteProduct() {
      axios
        .delete(`${apiUrl}/api/${apiPath}/admin/product/${this.tempProduct.id}`)
        .then((res) => {
          // console.log(res.data);
          alert(res.data.message);
          this.closeModal();
          this.$emit('update');
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    openModal() {
      this.delProductModal.show();
    },
    closeModal() {
      this.delProductModal.hide();
    },
  },
});


app.mount('#app');
