<template>
  <div
    style="height: 100%; overflow: hidden; padding: 15px; box-sizing: border-box;"
    class="sh_login"
  >
    <img src="../../assets/images/logo.png" alt="" style="width: 150px; height: 150px; margin-top: 30px;">
    <div style="margin-bottom: 30px; color: #fff;">您的纺纱智能助手</div>
    <div v-if="">
      <div>
        <group
          title=""
          style="text-align: left;"
          class="sh_input_group"
        >
          <x-input
            title="公司码"
            labelWidth="100px"
            type="text"
            :max=11
            name="corpCode"
            v-model="corpCode"
            @on-blur="onBlur"
            placeholder="请输入公司码"
            keyboard="number"
            class="sh_input_cell"
          ></x-input>
          <x-input
            title="手机号码"
            labelWidth="100px"
            type="text"
            v-model="mobilePhone"
            name="mobile"
            :max=11
            @on-focus="onFocus"
            placeholder="请输入手机"
            keyboard="number"
            class="sh_input_cell"
          >
            <i slot="label" class="iconfont icon-user" style="margin-right: 10px; font-size: 20px;"></i>
          </x-input>
          <x-input
            title="密码"
            labelWidth="100px"
            type="password"
            v-model="password"
            name="mobile"
            @on-focus="onFocus"
            placeholder="请输入密码"
            @on-enter="doLogin"
            class="sh_input_cell"
          >
            <i slot="label" class="iconfont icon-password" style="margin-right: 10px; font-size: 20px;"></i>
          </x-input>
        </group>
      </div>
      <group style="margin-top: 50px;" class="sh_input_group">
        <x-button
          text="登录"
          type="primary"
          actionType="button"
          :showLoading="isShowLoginLoading"
          @click.native="doLogin"
          style="padding: 3px;"
        ></x-button>
      </group>
    </div>
  </div>
</template>
<script type="text/babel">
  import { Group, XInput, XButton } from 'vux'
  import { Auth } from '../../utils/index'
  import Service from '../../service/service'
  export default {
    name: 'login',
    components: {
      Group,
      XInput,
      XButton
    },
    data () {
      return {
        mobilePhone: '',
        password: '',
        isShowLoginLoading: false,
        corpCode: this.$store.state.corpCode,
        // serviceAvailable: false,
        showLogin: true
      }
    },
    methods: {
      async onBlur(){
        if (!this.corpCode) {
          this.$vux.toast.show({
            type: 'text',
            width: 'auto',
            position: 'middle',
            text: '请输入公司码'
          })
          return
        }
        try {
          this.$store.commit('UPDATE_CORP_CODE', this.corpCode)
          await Service.getService()
          // this.serviceAvailable = true
        } catch (error) {
          // this.serviceAvailable = false
          this.$vux.toast.show({
            type: 'text',
            width: 'auto',
            position: 'middle',
            text: error.message
          })
        }
      },

      async doLogin () {
        const _this = this
        let message
        if(!this.corpCode){
          message = '请输入公司码'
        }else if(this.mobilePhone.length === 0) {
          message = '请输入手机号'
        } else if (!/^1[34578]\d{9}$/.test(this.mobilePhone)) {
          message = '请输入正确的手机号'
        } else if (this.password.length === 0) {
          message = '请输入密码'
        }
        if (message) {
          this.$vux.toast.show({
            type: 'text',
            width: 'auto',
            position: 'middle',
            text: message
          })
          return
        }
        this.isShowLoginLoading = true
        let ret
        try {
          ret = await Auth.login({
            userName: this.mobilePhone,
            password: this.password
          });
        } catch (error) {
          this.$vux.toast.show({
            type: 'text',
            text: '网络错误',
          })
        }

        this.isShowLoginLoading = false
        if (ret.success) {
          this.$store.commit('UPDATE_AUTH_MODULE_LIST', [])
          this.$store.commit('work/UPDATE_CURRENT_WORKSHOP_ID', [''])
          this.$vux.toast.show({
            text: '登录成功',
            time: 300,
            onHide () {
              _this.$store.commit('UPDATE_UID', _this.mobilePhone)
              _this.$router.push( '/product')
            }
          })
        } else {
          this.$vux.toast.show({
            type: 'warn',
            text: ret.message
          })
        }
      },
      async preCheck () {
        let corpCode = this.$store.state.corpCode
        let corpId = this.$store.state.corpId
        let authToken = this.$store.state.authToken

        if (corpCode && corpId && authToken) { // 三个都有就跳走
          this.$router.replace('/product')
        } else { // 三个不全有需要判断展示哪个页面
          if (corpCode) { // 有corpCode则尝试获取服务列表
            try {
              this.$store.commit('UPDATE_LOADING', true)
              await Service.getService()
              this.$store.commit('UPDATE_LOADING', false)
              // this.serviceAvailable = true
              this.showLogin = true
            } catch (e) {
              this.$store.commit('UPDATE_LOADING', false)
              this.showLogin = false // 获取失败则请用户输入CorpCode
            }
          } else {
            this.showLogin = false
          }
        }
      }
    },
    mounted () {
      this.preCheck()
    },
    activated () {
      this.preCheck()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .sh_login {
    background: url("../../assets/images/login-bg.jpg") center center;
    background-size: 100% 100%;
  }
  .sh_login .weui-cells:before,
  .sh_login .weui-cells:after {
    content: '';
    display: none;
  }
  .sh_login .weui_icon_clear:before {
    color: #fff;
  }

  .sh_login input::-webkit-input-placeholder {
    color: rgb(244,244,244);
  }
  .sh_login input {
    padding: 3px 0;
  }
  .sh_input_group,
  .sh_input_group>div {
    background-color: transparent;
  }
  .sh_input_group .sh_input_cell:first-child {
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 5px 5px 0 0;
  }
  .sh_input_group .sh_input_cell:nth-child(2) {
    background-color: rgba(255, 255, 255, 0.5);
  }

  .sh_input_group .sh_input_cell:last-child {
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 0 0 5px 5px;
  }
  .sh_input_group .sh_input_cell:only-child {
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 5px 5px;
  }
  .sh_input_group .sh_input_cell:not(:last-child) {
    border-bottom: 1px solid #fff;
  }
</style>
