console.log('product.js');
// # 使用 vue3 option 來撰寫產品列表

// 1. 驗證登入 `${apiUrl}/api/user/check`
// 2. 取得產品列表 `${apiUrl}/api/${apiPath}/admin/products/all`
// 3. 新增產品 `${apiUrl}/api/${apiPath}/admin/product`
// 4. 刪除、編輯產品 `${apiUrl}/api/${apiPath}/admin/product/${tempProduct.value.id}`


import { createApp, ref, onMounted } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
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
    }

    const getProducts = () => {
      axios
        .get(`${apiUrl}/api/${apiPath}/admin/products/all`)
        .then((res) => {
          console.log(res.data);
          products.value = res.data.products;
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    }
    const openModal = (status, item) => {
      if (status === 'new') {
        tempProduct.value = {
          imagesUrl: [],
        };
        isNew.value = true;
        productModal.show();
      } else if (status === 'edit') {
        tempProduct.value = { ...item };
        isNew.value = false;
        console.log('editTemp', tempProduct.value);
        productModal.show();
      } else if (status === 'delete') {
        tempProduct.value = { ...item };
        console.log('delTemp', tempProduct.value);
        delProductModal.show();
      }
    }
    const updateProduct = () => {
      let url = `${apiUrl}/api/${apiPath}/admin/product/${tempProduct.value.id}`;
      let http = 'put';

      if (isNew.value) {
        url = `${apiUrl}/api/${apiPath}/admin/product`;
        http = 'post';
      }
      axios[http](url, { data: tempProduct.value })
        .then((res) => {
          console.log(res.data);
          alert(res.data.message);
          productModal.hide();
          getProducts();
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    }
    const deleteProduct = () => {
      axios
        .delete(`${apiUrl}/api/${apiPath}/admin/product/${tempProduct.value.id}`)
        .then((res) => {
          console.log(res.data);
          alert(res.data.message);
          delProductModal.hide();
          getProducts();
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    }

    const createImages = () => {
      tempProduct.value.imagesUrl = [];
      tempProduct.value.imagesUrl.push('');
    }

    onMounted(() => {
      // openModal
      productModal = new bootstrap.Modal(
        document.getElementById('productModal'),
        {
          keyboard: false,
          backdrop: 'static',
        }
      );

      delProductModal = new bootstrap.Modal(
        document.getElementById('delProductModal'),
        {
          keyboard: false,
          backdrop: 'static',
        }
      );

      // 取得 cookie
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
        '$1'
      );
      // 將 token 加入到 headers
      axios.defaults.headers.common.Authorization = token;
      checkLogin();
    });


    return {
      products,
      isNew,
      tempProduct,
      openModal,
      updateProduct,
      deleteProduct,
      createImages,
    };
  },

});

app.mount('#app');
