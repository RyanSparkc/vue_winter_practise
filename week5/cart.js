console.log('index.js');
// # 使用 vue3 option 來撰寫產品列表

// 1.. 取得產品列表 `${apiUrl}/api/${apiPath}/products`  get
// 2.. 取得產品細節 `${apiUrl}/api/${apiPath}/product/{id}`  get
// 3. 新增/取得購物車 `${apiUrl}/api/${apiPath}/cart`  post / get
// 4. 刪除單一產品 `${apiUrl}/api/${apiPath}/cart/{id}`  delete
// 5. 刪除所有產品 `${apiUrl}/api/${apiPath}/carts`  delete
// 6. 調整購物車產品數量 `${apiUrl}/api/${apiPath}/cart/{id}` put
// 7. 結帳付款 `${apiUrl}/api/${apiPath}/order`  post


import userModal from './userModal.js';

const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;

defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('max', max);
defineRule('taiwanMobile', (value) => {
  return /^09\d{8}$/.test(value) || '手機號碼必須以09開頭，且為10位數字';
});

loadLocaleFromURL(
  'https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json'
);

configure({
  generateMessage: localize('zh_TW'),
});

import { apiUrl, apiPath } from '../js/config.js';

const app = Vue.createApp({
  data() {
    return {
      loadingStatus: {
        loadingItem: '',
      },
      products: [],
      product: {},
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
        },
        message: '',
      },
      cart: {},
      isLoading: true,
    };
  },
  methods: {
    //取得產品列表
    getProducts() {
      axios
        .get(`${apiUrl}/api/${apiPath}/products`)
        .then((res) => {
          this.products = res.data.products;
          this.isLoading = false;
        })
        .catch((err) => {
          alert(err.res.data.message);
        });
    },
    //取得單一產品
    getProduct(id) {
      this.loadingStatus.loadingItem = id;
      axios
        .get(`${apiUrl}/api/${apiPath}/product/${id}`)
        .then((res) => {
          this.loadingStatus.loadingItem = '';
          this.product = res.data.product;

          this.$refs.userModal.openModal();
        })
        .catch((err) => {
          alert(err.res.data.message);
        });
    },
    //加入購物車
    addToCart(product_id, qty = 1) {
      this.loadingStatus.loadingItem = product_id;
      const cart = {
        product_id,
        qty,
      };
      // console.log(cart);
      this.$refs.userModal.hideModal();
      axios
        .post(`${apiUrl}/api/${apiPath}/cart`, { data: cart })
        .then((res) => {
          alert(res.data.message);
          this.loadingStatus.loadingItem = '';
          this.getCart();
        })
        .catch((err) => {
          alert(err.res.data.message);
        });
    },
    //變更購物車數量
    changeCart(data, qty) {
      this.loadingStatus.loadingItem = data.id;
      const cart = {
        product_id: data.product_id,
        qty,
      };
      console.log(cart);
      axios
        .put(`${apiUrl}/api/${apiPath}/cart/${data.id}`, { data: cart })
        .then((res) => {
          alert(res.data.message);
          this.loadingStatus.loadingItem = '';
          this.getCart();
        })
        .catch((err) => {
          alert(err.res.data.message);
          this.loadingStatus.loadingItem = '';
        });
    },
    //取得購物車
    getCart() {
      axios
        .get(`${apiUrl}/api/${apiPath}/cart`)
        .then((res) => {
          this.cart = res.data.data;
        })
        .catch((err) => {
          alert(err.res.data.message);
        });
    },
    //清空購物車
    deleteAllCarts() {
      axios
        .delete(`${apiUrl}/api/${apiPath}/carts`)
        .then((res) => {
          alert(res.data.message);
          this.getCart();
        })
        .catch((err) => {
          alert(err.res.data.message);
        });
    },
    //移除購物車項目
    removeCartItem(id) {
      this.loadingStatus.loadingItem = id;
      axios
        .delete(`${apiUrl}/api/${apiPath}/cart/${id}`)
        .then((res) => {
          alert(res.data.message);
          this.loadingStatus.loadingItem = '';
          this.getCart();
        })
        .catch((err) => {
          alert(err.res.data.message);
        });
    },
    //建立訂單
    createOrder() {
      const order = this.form;
      axios
        .post(`${apiUrl}/api/${apiPath}/order`, { data: order })
        .then((res) => {
          alert(res.data.message);
          this.$refs.form.resetForm();
          this.form.message = '';
          this.getCart();
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
  },
  components: {
    VForm: Form,
    VField: Field,
    ErrorMessage: ErrorMessage,
  },
  mounted() {
    this.getProducts();
    this.getCart();
  },
});
app.component('loading', VueLoading.Component);
app.component('userModal', userModal);
app.mount('#app');


console.log(VueLoading);