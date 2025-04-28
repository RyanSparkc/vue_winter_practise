<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <RouterLink class="navbar-brand" to="/">Logo</RouterLink>
      <button class="navbar-toggler"
       type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <RouterLink class="nav-link" to="/about">關於我們</RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink class="nav-link" to="/products">產品列表</RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink class="nav-link" to="/cart">購物車</RouterLink>
        </li>
      </ul>
      <div>
        <ul class="navbar-nav">
          <li class="nav-item">
            <RouterLink class="nav-link" to="/login">登入</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/admin/products">後台 - 購物車列表</RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <h2>這是前台</h2>
  <hr>

  <RouterView />
</template>
