<template>
  <div class="container">
    <div class="row mt-3">
      <UserModal ref="userModal" :product="product" @add-to-cart="addToCart"></UserModal>
      <table class="table align-middle">
        <thead>
          <tr>
            <th>圖片</th>
            <th>商品名稱</th>
            <th>價格</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id">
            <td style="width: 200px">
              <div v-if="!product.imageUrl == ''"
                style="height: 100px; background-size: cover; background-position: center"
                :style="{ backgroundImage: `url(${product.imageUrl})` }"></div>
            </td>
            <td>
              {{ product.title }}
            </td>
            <td>
              <div class="h5" v-if="product.origin_price
              === product.price">{{ product.origin_price }} 元</div>
              <div v-else>
                <del class="h6" v-if="product.price">原價 {{ product.origin_price }} 元</del>
                <div class="h5" v-if="product.price">現在只要 {{ product.price }} 元</div>
              </div>
            </td>
            <td>
              <div class="btn-group btn-group-sm">
                <button type="button" class="btn btn-outline-secondary"
                @click="getProduct(product.id)"
                  :disabled="product.id === loadingStatus.loadingItem || !product.is_enabled">
                  <i class="fas fa-spinner fa-pulse"
                  v-if="loadingStatus.loadingItem === product.id"></i>
                  查看更多
                </button>
                <button type="button" class="btn btn-outline-danger" @click="addToCart(product.id)"
                  :disabled="product.id === loadingStatus.loadingItem || !product.is_enabled">
                  <i class="fas fa-spinner fa-pulse"
                  v-if="loadingStatus.loadingItem === product.id"></i>
                  加到購物車
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import UserModal from '@/components/UserModal.vue';

const { VITE_APP_URL, VITE_APP_PATH } = import.meta.env;
export default {
  data() {
    return {
      loadingStatus: {
        loadingItem: '',
      },
      // 產品資料格式
      products: [],
      product: {},
      cart: {},
      isLoading: true,
    };
  },
  methods: {
    getProducts() {
      axios
        .get(`${VITE_APP_URL}/api/${VITE_APP_PATH}/products`)
        .then((res) => {
          this.products = res.data.products;
          this.isLoading = false;
        })
        .catch((err) => {
          alert(err.res.data.message);
        });
    },
    // 取得單一產品
    getProduct(id) {
      this.loadingStatus.loadingItem = id;
      axios
        .get(`${VITE_APP_URL}/api/${VITE_APP_PATH}/product/${id}`)
        .then((res) => {
          this.loadingStatus.loadingItem = '';
          this.product = res.data.product;

          this.$refs.userModal.openModal();
        })
        .catch((err) => {
          alert(err.res.data.message);
        });
    },
    // 加入購物車
    addToCart(productId, qty = 1) {
      this.loadingStatus.loadingItem = productId;
      const cart = {
        product_id: productId,
        qty,
      };
      // console.log(cart);
      this.$refs.userModal.hideModal();
      axios
        .post(`${VITE_APP_URL}/api/${VITE_APP_PATH}/cart`, { data: cart })
        .then((res) => {
          alert(res.data.message);
          this.loadingStatus.loadingItem = '';
          this.getCart();
        })
        .catch((err) => {
          alert(err.res.data.message);
        });
    },
    // 變更購物車數量
    changeCart(data, qty) {
      this.loadingStatus.loadingItem = data.id;
      const cart = {
        product_id: data.product_id,
        qty,
      };
      console.log(cart);
      axios
        .put(`${VITE_APP_URL}/api/${VITE_APP_PATH}/cart/${data.id}`, { data: cart })
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
  },
  mounted() {
    this.getProducts();
  },
  components: {
    UserModal,
  },
};
</script>
<style scoped>
img {
  object-fit: contain;
  max-width: 100%;
}

.primary-image {
  height: 300px;
}

.images {
  height: 150px;
}
</style>
