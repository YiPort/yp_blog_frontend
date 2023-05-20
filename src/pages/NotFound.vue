<template>
  <div class="center">
    <div class="notfound-container">
      <h1 class="notfound">404</h1>
      <h2 class="notfound-text">你要找的页面不见了</h2>
      <router-link to="/" class="back">返回主页</router-link>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped>
.center {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(120deg, #93834d 0%, #566ebc 100%);
}

.notfound-container {
  text-align: center;
  border-radius: 50px;
  background: rgba(255, 255, 255, 0.7);
  padding: 8em;
  box-shadow: 0px 50px 30px -5px rgba(0, 0, 0, 0.3);
}

.notfound {
  font-size: 6em;
  color: #333;
}

.notfound-text {
  font-size: 2em;
  color: #666;
  margin-top: 0.5em;
}

.back {
  display: inline-block;
  text-decoration: none;
  color: #333;
  font-size: 1em;
  margin-top: 2em;
  padding: 0.5em 2em;
  border: 2px solid #333;
  border-radius: 5px;
  transition: color 0.2s ease-in-out, background-color 0.2s ease-in-out;
}

.back:hover {
  color: #fff;
  background-color: #333;
}
</style>