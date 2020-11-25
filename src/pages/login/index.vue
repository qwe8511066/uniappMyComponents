<template>
  <view class>
    <u-card>
      <view class slot="body">
        <u-form :model="form" ref="uForm" class="myForm" label-width="120">
          <u-form-item label="用户名称" prop="userName">
            <u-input v-model="form.userName" />
          </u-form-item>
          <u-form-item label="登录密码" prop="password">
            <u-input v-model="form.password" type="password" />
          </u-form-item>
        </u-form>
        <u-button @click="submit">提交</u-button>
      </view>
    </u-card>
  </view>
</template>

<script>
import { getToken, removeToken, setToken } from '@/utils/auth'
import { checkArrayString } from '@/utils/index'
export default {
  data() {
    return {
      form: {
        userName: 'admin',
        password: '11111111',
      },
      rules: {
        userName: [
          {
            required: true,
            message: '这是必填项',
            trigger: ['blur', 'change'],
          },
        ],
        password: [
          {
            required: true,
            min: 6,
            message: '密码长度必须在6位数以上',
            trigger: ['blur', 'change'],
          },
        ],
      },
    }
  },
  methods: {
    submit() {
      this.$refs.uForm.validate((valid) => {
        if (valid) {
          uni.showLoading()
          this.$http.post('/api/account/loginwithpwd', this.form).then(
            (data) => {
              setToken(data.access_token)
              uni.redirectTo({
                url: `/pages/index/index`,
              })
              uni.hideLoading()
            },
            (err) => {
              uni.hideLoading()
            }
          )
        }
      })
    },
  },
  onLoad() {},
  // 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
  onReady() {
    this.$refs.uForm.setRules(this.rules)
  },
  onShow() {
    wx.hideHomeButton()
  },
}
</script>