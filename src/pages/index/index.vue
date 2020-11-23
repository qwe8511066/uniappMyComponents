<template>
  <view class>
    <u-form :model="form" ref="uForm" class="myForm">
      <u-form-item label="姓名" prop="name">
        <u-input v-model="form.name" />
      </u-form-item>
      <u-form-item label="兴趣爱好" prop="checkboxList">
        <u-checkbox-group>
          <u-checkbox
            v-model="item.checked"
            v-for="(item, index) in form.checkboxList"
            :key="index"
            :name="item.name"
          >{{item.name}}</u-checkbox>
        </u-checkbox-group>
      </u-form-item>
    </u-form>
    <u-button @click="submit">提交</u-button>
  </view>
</template>

<script>
import { checkArrayString } from '@/utils/index'
export default {
  data() {
    return {
      form: {
        name: '',
        checkboxList: [
          {
            name: 'apple',
            checked: false,
            disabled: false,
          },
          {
            name: 'banner',
            checked: false,
            disabled: false,
          },
          {
            name: 'orange',
            checked: false,
            disabled: false,
          },
        ],
      },
      rules: {
        name: [
          {
            required: true,
            message: '这是必填项',
            trigger: ['blur', 'change'],
          },
        ],
        checkboxList: [
          {
            validator: (rule, value, callback) => {
              return checkArrayString(value, 'checked', true) != -1
            },
            message: '这是必选项',
          },
        ],
      },
    }
  },
  methods: {
    submit() {
      this.$refs.uForm.validate((valid) => {
        if (valid) {
          console.log('验证通过')
        } else {
          console.log('验证失败')
        }
      })
    },
  },
  // 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
  onReady() {
    this.$refs.uForm.setRules(this.rules)
  },
}
</script>