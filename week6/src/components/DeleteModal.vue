<template>
  <div id="delProductModal" ref="delProductModal" class="modal fade" tabindex="-1"
    aria-labelledby="delProductModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content border-0">
        <div class="modal-header bg-danger text-white">
          <h5 id="delProductModalLabel" class="modal-title">
            <span>刪除產品</span>
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"
           aria-label="Close"></button>
        </div>
        <div class="modal-body">
          是否刪除
          <strong class="text-danger">{{tempProduct.title}}</strong> 商品(刪除後將無法恢復)。
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
            取消
          </button>
          <button type="button" class="btn btn-danger" @click="deleteProduct">
            確認刪除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import { Modal } from 'bootstrap';

const { VITE_APP_URL, VITE_APP_PATH } = import.meta.env;
export default {
  data() {
    return {
      delProductModal: null,
      editProduct: {},
    };
  },
  props: ['tempProduct'],
  emits: ['update'],
  mounted() {
    // delModal
    this.delProductModal = new Modal(
      document.getElementById('delProductModal'),
      {
        keyboard: false,
        backdrop: 'static',
      },
    );
  },
  methods: {
    deleteProduct() {
      axios
        .delete(`${VITE_APP_URL}/api/${VITE_APP_PATH}/admin/product/${this.tempProduct.id}`)
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
};
</script>
