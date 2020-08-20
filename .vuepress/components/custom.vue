<template>
  <div class='other-pages'>
    <header>
      哈哈哈哈, 这是一个vue组件文件
    </header>
    <Content/>
  </div>
</template>
<script>
export default {
  name: 'other-pages',
  mounted() {
    console.log(this)
  }
}
</script>
<style scoped>
.other-pages {
  padding: 0 50px;
}
header {
  text-align: center;
  font-size: 20px;
}
</style>
