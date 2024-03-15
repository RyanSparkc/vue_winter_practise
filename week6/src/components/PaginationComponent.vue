<template>
  <nav aria-label="Page navigation example">
    <ul class="pagination">
      <li class="page-item" :class="{ 'disabled': pages.current_page === 1 }">
        <a class="page-link" @click.prevent="emitPages(pages.current_page - 1)"
        href="#" aria-label="Previous">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
      <li v-for="(item, index) in pages.total_pages" :key="index" class="page-item"
        :class="{ 'active': item === pages.current_page }">
        <span class="page-link" v-if="item === pages.current_page">{{ item }}</span>
        <a class="page-link" v-else href="#" @click.prevent="emitPages(item)">{{ item }}</a>
      </li>
      <li class="page-item" :class="{ 'disabled': pages.current_page === pages.total_pages }">
        <a class="page-link" href="#"
        @click.prevent="emitPages(pages.current_page + 1)" aria-label="Next">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </nav>
</template>
<script>
export default {
  emits: ['emit-change-pages'],
  props: ['pages'],
  methods: {
    emitPages(item) {
      this.$emit('emit-change-pages', item);
    },
  },
};
</script>
