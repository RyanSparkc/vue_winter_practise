import {
  createApp,
  ref,
  reactive,
  onMounted,
} from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import { apiUrl, apiPath } from '../js/config.js';

const app = createApp({
  setup() {
    const products = ref([]);
    const isNew = ref(false);
    const tempProduct = reactive({
      imagesUrl: [],
    });
    const pagination = ref({});

    const productModalRef = ref(null);
    const delProductModalRef = ref(null);

    const checkLogin = () => {
      axios
        .post(`${apiUrl}/api/user/check`)
        .then((res) => {
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
          console.log(res.data);
          const { products: productsData, pagination: paginationData } =
            res.data;
          products.value = productsData;
          pagination.value = paginationData;
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    };

    const openModal = (status, item) => {
      if (status === 'new') {
        Object.assign(tempProduct, {
          imagesUrl: [],
        });
        isNew.value = true;
        console.log('new', tempProduct);
        productModalRef.value.openModal();
      } else if (status === 'edit') {
        Object.assign(tempProduct, item);
        isNew.value = false;
        productModalRef.value.openModal();
      } else if (status === 'delete') {
        Object.assign(tempProduct, item);
        delProductModalRef.value.openModal();
      }
    };

    onMounted(() => {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
        '$1'
      );
      axios.defaults.headers.common.Authorization = token;
      checkLogin();
    });

    return {
      products,
      isNew,
      tempProduct,
      pagination,
      getProducts,
      openModal,
      productModalRef,
      delProductModalRef,
    };
  },
});

app.component('pagination', {
  props: ['pages'],
  emits: ['emit-change-pages'],
  setup(props, { emit }) {
    const emitPages = (item) => {
      emit('emit-change-pages', item);
    };

    return {
      emitPages,
    };
  },
  template: '#pagination',
});

app.component('product-modal', {
  props: ['tempProduct', 'isNew'],
  emits: ['update'],
  setup(props, { emit }) {
    const productModal = ref(null);

    const updateProduct = () => {
      let url = `${apiUrl}/api/${apiPath}/admin/product/${props.tempProduct.id}`;
      let http = 'put';

      if (props.isNew) {
        url = `${apiUrl}/api/${apiPath}/admin/product`;
        http = 'post';
      }
      axios[http](url, { data: props.tempProduct })
        .then((res) => {
          alert(res.data.message);
          closeModal();
          emit('update');
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    };

    const createImages = () => {
      if (!props.tempProduct.imagesUrl) {
        props.tempProduct.imagesUrl = [];
      }
      props.tempProduct.imagesUrl.push('');
    };

    const openModal = () => {
      productModal.value.show();
    };

    const closeModal = () => {
      productModal.value.hide();
    };

    onMounted(() => {
      productModal.value = new bootstrap.Modal(
        document.getElementById('productModal'),
        {
          keyboard: false,
          backdrop: 'static',
        }
      );
    });

    return {
      updateProduct,
      createImages,
      openModal,
      closeModal,
    };
  },
  template: '#productModal',
});

app.component('del-product-modal', {
  props: ['tempProduct'],
  emits: ['update'],
  setup(props, { emit }) {
    const delProductModal = ref(null);

    const deleteProduct = () => {
      axios
        .delete(
          `${apiUrl}/api/${apiPath}/admin/product/${props.tempProduct.id}`
        )
        .then((res) => {
          alert(res.data.message);
          closeModal();
          emit('update');
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    };

    const openModal = () => {
      delProductModal.value.show();
    };

    const closeModal = () => {
      delProductModal.value.hide();
    };

    onMounted(() => {
      delProductModal.value = new bootstrap.Modal(
        document.getElementById('delProductModal'),
        {
          keyboard: false,
          backdrop: 'static',
        }
      );
    });

    return {
      deleteProduct,
      openModal,
      closeModal,
    };
  },
  template: '#delProductModal',
});

app.mount('#app');
