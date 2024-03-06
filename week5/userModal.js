export default {
  template: '#userModal',
  props: ['product'],
  data() {
    return {
      status: {},
      productModal: '',
      qty: 1,
    };
  },
  mounted() {
    this.productModal = new bootstrap.Modal(this.$refs.modal, {
      keyboard: false,
      backdrop: 'static',
    });
  },
  methods: {
    openModal() {
      this.productModal.show();
    },
    hideModal() {
      this.productModal.hide();
    },
  },
  watch: {
    product() {
      this.qty = 1;
    },
  },
};