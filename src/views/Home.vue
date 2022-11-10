<template>
  <div class="home">
    子应用
  </div>
</template>
<script setup>
import { reactive, ref } from 'vue'

const formDom = ref(null)

const state = reactive({
  options: {
    mode: 'code',
    mainMenuBar: false
  },
  show: true
})
const submitForm = () => {
  formDom.value.validate((valid) => {
    if (valid) {
      console.log(valid, 'this.valid')
    } else {
      console.log(valid, '验证失败')
    }
    return false
  })
}
</script>
<style scoped>
.home {
  padding: 10px;
}
</style>
