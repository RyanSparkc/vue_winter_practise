<template>
  <h2>產品列表</h2>
  <div class="container">
    <div class="text-end mt-4">
      <button class="btn btn-primary" @click="openModal('new')">
        建立新的產品
      </button>
    </div>
    <table class="table mt-4">
      <thead>
        <tr>
          <th width="120">
            分類
          </th>
          <th>產品名稱</th>
          <th width="120">
            原價
          </th>
          <th width="120">
            售價
          </th>
          <th width="100">
            是否啟用
          </th>
          <th width="120">
            編輯
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in products" :key="item.id">
          <td>{{ item.category }}</td>
          <td>{{ item.title }}</td>
          <td class="text-end">{{ item.origin_price }}</td>
          <td class="text-end">{{ item.price }}</td>
          <td>
            <span v-if="item.is_enabled" class="text-success">啟用</span>
            <span v-else>未啟用</span>
          </td>
          <td>
            <div class="btn-group">
              <button type="button" class="btn btn-outline-primary
              btn-sm" @click="openModal('edit', item)">
                編輯
              </button>
              <button type="button" class="btn btn-outline-danger btn-sm"
               @click="openModal('delete', item)">
                刪除
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <PaginationComponent :pages="pagination" @emit-change-pages="getProducts"></PaginationComponent>
  </div>

  <ProductModal ref="productModal" :temp-product="tempProduct"
  :is-new="isNew" @update="getProducts"></ProductModal>

  <DeleteModal ref="deleteModal" :temp-product="tempProduct" @update="getProducts"></DeleteModal>

</template>

<script>
import axios from 'axios';
import ProductModal from '../../components/ProductModal.vue';
import DeleteModal from '../../components/DeleteModal.vue';
import PaginationComponent from '../../components/PaginationComponent.vue';

const { VITE_APP_URL, VITE_APP_PATH } = import.meta.env;

export default {
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
  methods: {
    checkLogin() {
      axios
        .post(`${VITE_APP_URL}/api/user/check`)
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
        .get(`${VITE_APP_URL}/api/${VITE_APP_PATH}/admin/products?page=${page}`)
        .then((res) => {
          // console.log(res.data);
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
        this.$refs.deleteModal.openModal();
      }
    },
  },
  mounted() {
    this.getProducts();
  },
  components: {
    ProductModal,
    DeleteModal,
    PaginationComponent,
  },
};
</script>
