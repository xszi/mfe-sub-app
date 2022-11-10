export const generateCode = function (formJson, codeType = 'vue') {
  // let formJsonStr = JSON.stringify(formJson)
  const formJsonStr = JSON.stringify(formJson, null, '  ')
  if (codeType === 'html') {
    return `<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no" />
	<title>VForm Demo</title>
	<link rel="stylesheet" href="//unpkg.com/element-plus/dist/index.css" />
	<link rel="stylesheet" href="https://ks3-cn-beijing.ksyun.com/vform3/render.style.css?t=20220129">
	<style type="text/css">
	</style>
</head>
<body>

  <div id="sub-app">
	  <v-form-render :form-json="formJson" :form-data="formData" :option-data="optionData" ref="vFormRef">
    </v-form-render>
	  <el-button type="primary" @click="submitForm">Submit</el-button>
  </div>

<script src="//unpkg.com/vue@next"></script>
<script src="//unpkg.com/element-plus"></script>
<script src="https://ks3-cn-beijing.ksyun.com/vform3/render.umd.js?t=20220129"></script>
<script>
  const { createApp } = Vue;
	const app = createApp({
      data() {
        return {
          formJson: ${formJsonStr},
          formData: {},
          optionData: {}
        }
      },
      methods: {
        submitForm: function() {
          this.$refs.vFormRef.getFormData().then( function(formData) {
            // Form Validation OK
            alert( JSON.stringify(formData) )
          }).catch( function(error) {
            // Form Validation Failed
            alert(error)
          })
        }
      }
	});
	app.use(ElementPlus)
	app.use(VFormRender)
	app.mount("#app");
</script>
</body>
</html>`
  }
  return `<template>
  <div>
    <sl-form :form-json="formJson" :form-data="formData" :option-data="optionData" ref="refForm">
    </v-form-render>
    <el-button type="primary" @click="submitForm">Submit</el-button>
  </div>
</template>

<script setup>
  import { ref, reactive } from 'vue'
  import { ElMessage } from 'element-plus'

  const formJson = reactive(${formJsonStr})
  const formData = reactive({})
  const optionData = reactive({})
  const refForm = ref(null)

  const submitForm = () => {
    refForm.value.getFormData().then(formData => {
      // Form Validation OK
      alert( JSON.stringify(formData) )
    }).catch(error => {
      // Form Validation failed
      ElMessage.error(error)
    })
  }
</script>`
}
