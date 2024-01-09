console.log('login.js');

// # 使用 vue3 composition 來撰寫登入方法
import { createApp, ref, } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import { apiUrl } from '../js/config.js';

const app = createApp({
  setup() {
    const user = ref({
      username: '',
      password: '',
    });

    const login = () => {
      axios.post(`${apiUrl}/admin/signin`, user.value).then((res) => {
        const {token, expired} = res.data;
        // 寫入 cookie token
        // expires 設置有效時間
        // path=/ 設置根目錄，所有頁面都可以取得
        // console.log(token);
        document.cookie = `hexToken=${token}; expires=${new Date(expired)};`;
        window.location = 'product.html';
      }).catch((err) => {
        alert(err.response.data.message);
      });
    }

    return {
      user,
      login,
    }
  }
});

app.mount('#app');

// eyJhbGciOiJSUzI1NiIsImtpZCI6ImxrMDJBdyJ9.eyJpc3MiOiJodHRwczovL3Nlc3Npb24uZmlyZWJhc2UuZ29vZ2xlLmNvbS92dWUtY291cnNlLWFwaSIsImF1ZCI6InZ1ZS1jb3Vyc2UtYXBpIiwiYXV0aF90aW1lIjoxNzA0Nzg1MjM3LCJ1c2VyX2lkIjoidGw5emd3aUlPck94UmM0UTB4TDQ2UDBoZGtmMSIsInN1YiI6InRsOXpnd2lJT3JPeFJjNFEweEw0NlAwaGRrZjEiLCJpYXQiOjE3MDQ3ODUyMzgsImV4cCI6MTcwNTIxNzIzOCwiZW1haWwiOiJibHVlZ3gwOEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJibHVlZ3gwOEBnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.SYJpdJPoMrpKwHXfJdsEN6FJnuX1n8Td8zKmzyy5f-X6QG4t-8gtMMtpf7WETwWcksJ5fNe_TcRCqUAkcNuo6PpoAGomQg1SXO4luH3SejL5gwGJnBoWZSs8q6a0yfrbrgoQRFG7PZDntWmhjZIkSGWhx55zVRmToHI2IZmd045j_VmlfvC88kBIRlfwjT-MGmXHcmiJZYyuPv2e0Y0dVCaChgzWLl6PKbucJ19v-Pobn-Xp1BUzs9Ih_oN7z23HmFlN30suOiLK9_VOYI-mCarDKJo5DXIZYgLu7g62AhL8CWq4h2WR9aO_AgHk7ihNAgP5w1mgpuOJBZX8L6tCuA
