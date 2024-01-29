console.log('product.js');
// # 使用 vue3 option 來撰寫產品列表

// 1. 驗證登入 `${apiUrl}/api/user/check`
// 2. 取得產品列表 `${apiUrl}/api/${apiPath}/admin/products/all`
// 3. 新增產品 `${apiUrl}/api/${apiPath}/admin/product`
// 4. 刪除、編輯產品 `${apiUrl}/api/${apiPath}/admin/product/${this.tempProduct.id}`


import { createApp, ref, onMounted, } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import { apiUrl, apiPath } from '../js/config.js';

let productModal = null;
let delProductModal = null;

const app = createApp({
  setup() {
    const products = ref([]);
    const isNew = ref(false);
    const tempProduct = ref({
      imagesUrl: [],
    });
    const pagination = ref({}); // 分頁資料

    onMounted(() => {
      // 取得 cookie
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
        '$1'
      );
      // 將 token 加入到 headers
      axios.defaults.headers.common.Authorization = token;
      checkLogin();
    });

    const checkLogin = () => {
      axios
        .post(`${apiUrl}/api/user/check`)
        .then((res) => {
          // console.log(res.data);
          if (res.data.success) {
            getProducts();
          }
        })
        .catch((err) => {
          alert(err.response.data.message);
          window.location = 'login.html';
        });
    };

    const getProducts = (page = 1) => {
      axios
        .get(`${apiUrl}/api/${apiPath}/admin/products?page=${page}`)
        .then((res) => {
          // console.log(res.data);
          // this.products = res.data.products;
          const { products, pagination } = res.data;
          products.value = products;
          pagination.value = pagination;
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    };

    const openModal = (status, item) => {
      if (status === 'new') {
        tempProduct.value = {
          imagesUrl: [],
        };
        isNew.value = true;
        console.log('new', tempProduct.value);
        productModal.show();
      } else if (status === 'edit') {
        tempProduct.value = { ...item };
        isNew.value = false;
        // console.log('editTemp', tempProduct.value);
        productModal.show();
      } else if (status === 'delete') {
        tempProduct.value = { ...item };
        // console.log('delTemp', tempProduct.value);
        delProductModal.show();
      }
    };



    return {
      products,
      isNew,
      tempProduct,
      pagination,
      getProducts,
      openModal,
    };
  }
});

// 分頁元件
app.component('pagination', {
  // 定義元件的模板、數據和方法
  template: '#pagination',
  emits: ['emit-change-pages'],
  props: ['pages'],
  setup(){
    const emitPages = (item) => {
      emit('emit-change-pages', item);
    }
    return {
      emitPages,
    }
  }
});

// 產品模態框元件
app.component('product-modal', {
  // 定義元件的模板、數據和方法
  template: '#productModal',
  props: ['tempProduct', 'isNew'],
  emits: ['update'],
  setup(){
    onMounted(() => {
      // openModal
      productModal = new bootstrap.Modal(
        document.getElementById('productModal'),
        {
          keyboard: false,
          backdrop: 'static',
        }
      );
    });

    const updateProduct = () => {
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
          emit('update');
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    };
    const createImages = () => {
      this.tempProduct.imagesUrl = [];
      this.tempProduct.imagesUrl.push('');
    };
    const openModal = () => {
      productModal.show();
    };
    const closeModal = () => {
      productModal.hide();
    };
    return {
      updateProduct,
      createImages,
      openModal,
      closeModal,
    }
  }
});

// 刪除產品模態框元件
app.component('del-product-modal', {
  template: '#delProductModal',
  props: ['tempProduct'],
  emits: ['update'],
  setup(){
    onMounted(() => {
      // delModal
      delProductModal = new bootstrap.Modal(
        document.getElementById('delProductModal'),
        {
          keyboard: false,
          backdrop: 'static',
        }
      );
    });

    const deleteProduct = () => {
      axios
        .delete(`${apiUrl}/api/${apiPath}/admin/product/${this.tempProduct.id}`)
        .then((res) => {
          // console.log(res.data);
          alert(res.data.message);
          this.closeModal();
          emit('update');
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    };
    const openModal = () => {
      delProductModal.show();
    };
    const closeModal = () => {
      delProductModal.hide();
    };
    return {
      deleteProduct,
      openModal,
      closeModal,
    }
  }
});


app.mount('#app');
