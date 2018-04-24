<template>
  <div
    style="height: 100%; overflow: scroll; box-sizing: border-box;"
  >

    <img
      src="../../assets/images/icon-earphone.svg"
      style="position: fixed; top: 10px; right: 10px; width: 30px; z-index: 100;"
    >
    <!--<blur :blur-amount=10 url="https://o3e85j0cv.qnssl.com/tulips-1083572__340.jpg"></blur>-->
    <div style="position: relative; width: 100%; padding-top: 40.874%;">
      <img :src="banner" alt="" style="position:absolute; left: 0; top: 0; width: 100%; height: 100%;">
      <!--<blur :blur-amount=2 :url="banner" style="position:absolute; left: 0; top: 0; width: 100%; height: 100%;">-->
      <!--</blur>-->
      <div style="position: absolute; top: 27%; left: 4%; color: rgba(255, 255, 255, 0.8)">当天本车间产量</div>
      <div style="position: absolute; top: 43%; left: 12%; color: rgba(255, 255, 255, 1); font-size: 28px;"><countup :start-val="output / 100" :end-val="output"></countup><span style="font-size: 13px;">公斤</span></div>
      <div style="position: absolute; top: 27%; left: 55%; color: rgba(255, 255, 255, 0.8);">当前运转状态</div>
      <img src="../../assets/images/icon-right.svg" style="position: absolute;top: 47%;left: 66%;color: rgba(255, 255, 255, 0.6);width: 9%;">
    </div>
    <div class="container" style="background-color: #E8F7F7; padding-bottom: 20px;">
      <!--<swiper :list="banners" v-model="bannerIndex"></swiper>-->
      <div class="scrollBox" style="position: relative; width: 100%; padding: 20px 0; background-color: #fff;">
        <table style="width: 100%;">
          <tbody class="top_table">
          <tr>
            <td @click="$router.push('/operate-sheet')">
              <img src="../../assets/images/icon-user.svg" alt="">
              <br/>
              工艺信息
            </td>
            <td @click="showPlugin">
              <img src="../../assets/images/icon-settings.svg" alt="">
              <br/>
              生产预警
            </td>
            <td @click="$router.push('/operate/open')">
              <img src="../../assets/images/icon-play.svg" alt="">
              <br/>
              品种开台
            </td>
            <td @click="$router.push('/operate/close')">
              <img src="../../assets/images/icon-pause.svg" alt="">
              <br/>
              品种了机
            </td>
          </tr>
          </tbody>
        </table>
        <div style="clear: both"></div>
      </div>
      <div style="background-color: #E8F7F7; padding: 4px;">
        <table class="main_table" style="width: 100%; border-spacing: 2px;">
          <colgroup>
            <col width="28%">
            <col width="36%">
            <col width="36%">
          </colgroup>
          <tbody>
          <tr>
            <td
              class="blue"
              rowspan="2"
              @click="$router.push('/employee')"
              :style="{'background-image': 'url(' + bgUser + ')'}"
              style="background-size: 80%; background-position: bottom right; background-repeat: no-repeat;"
            >人员</td>
            <td class="blue-light" @click="$router.push('/employee/attendance')">人员考勤</td>
            <td class="blue-light" @click="$router.push('/employee/replace')">人员替岗</td>
          </tr>
          <tr>
            <td class="blue-light" @click="$router.push('/report')">产量报工</td>
            <td class="blue-light" @click="$router.push('/StandAllocation/standAllocation')">看台分配</td>
          </tr>
          </tbody>
        </table>
        <table class="main_table" style="width: 100%; border-spacing: 2px;">
          <colgroup>
            <col width="28%">
            <col width="36%">
            <col width="36%">
          </colgroup>
          <tbody>
          <tr>
            <td class="red" :style="{'background-image': 'url(' + bgMachine + ')'}" style="background-size: 80%; background-position: bottom right; background-repeat: no-repeat;" @click="$router.push('/machine/maintainHome')">机器</td>
            <td class="red-light" @click="$router.push('/machine/maintainTask')">设备保养</td>
            <td class="red-light" @click="$router.push('/Repair/repairCall')">设备维修</td>
          </tr>
          </tbody>
        </table>
        <table class="main_table" style="width: 100%; border-spacing: 2px;">
          <colgroup>
            <col width="28%">
            <col width="36%">
            <col width="36%">
          </colgroup>
          <tbody>
          <tr class="green">
            <td
              class="orange"
              :style="{'background-image': 'url(' + bgMaterial + ')'}"
              style="background-size: 80%; background-position: bottom right; background-repeat: no-repeat;"
              @click="showPlugin">物料</td>
            <td class="orange-light">配棉品种</td>
            <td class="orange-light" @click="showPlugin">配件更换</td>
          </tr>
          </tbody>
        </table>
        <table class="main_table" style="width: 100%; border-spacing: 2px;">
          <colgroup>
            <col width="28%">
            <col width="36%">
            <col width="36%">
          </colgroup>
          <tbody>
          <tr>
            <td
              class="purple"
              :style="{'background-image': 'url(' + bgPower + ')'}"
              style="background-size: 80%; background-position: bottom right; background-repeat: no-repeat;"
              @click="showPlugin">能源</td>
            <td class="purple-light" @click="showPlugin">温湿度状态</td>
            <td class="purple-light" @click="showPlugin">设备电量</td>
          </tr>
          </tbody>
        </table>
      </div>

      <div style="text-align: left; padding: 5px 10px; border-bottom: 2px solid #CCDFE2; background-color: #fff;">检测</div>
      <table style="width: 100%; border-collapse: collapse; background-color: #fff;">
        <colgroup>
          <col width="50%">
          <col width="50%">
        </colgroup>
        <tbody>
        <tr>
          <td style="padding: 10px;" @click="showPlugin"><img src="../../assets/images/icon-search-a.svg" style="width: 20px; vertical-align: sub; margin-right: 5px;">在制品检验</td>
          <td style="padding: 10px; border-left: 2px solid #CCDFE2" @click="showPlugin"><img src="../../assets/images/icon-search-b.svg" style="width: 20px; vertical-align: sub; margin-right: 5px;">成品检验</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script type="text/babel">
  import {
    Blur,
    Swiper,
    Scroller,
    Alert,
    TransferDom,
    Countup
  } from 'vux'
  import banner1 from '../../assets/images/banner.jpg'
  import bgUser from '../../assets/images/bg-user.svg'
  import bgMachine from '../../assets/images/bg-machine.svg'
  import bgMaterial from '../../assets/images/bg-materiel.svg'
  import bgPower from '../../assets/images/bg-power.svg'
  import { mapState } from 'vuex'

  export default {
    directives: {
      TransferDom
    },
    name: 'home',
    components: {
      Blur,
      Swiper,
      Alert,
      Scroller,
      Countup
    },
    data () {
      return {
        banner: banner1,
        show: false,
        bgMachine: bgMachine,
        bgUser: bgUser,
        bgMaterial: bgMaterial,
        bgPower: bgPower,
        output: this.getOutput(),
        timer: null
      }
    },
    computed: {
      ...mapState({
        uid: (state) => state.uid
      })
    },
    methods: {
      getOutput () {
        return +String(Math.floor(new Date().getTime() / 10000)).slice(4)
      },
      setTimer () {
        this.timer = setInterval(() => {
          this.output = this.getOutput()
        }, 1000)
      },
//      $router.push('/machine/MachineMaintenance')
      showPlugin (){
        let msg = '<div style="text-align: left;color:#5c5c5c">由于此账号为测试账号,无此权限,如需了解更多,请致电<span style="color:red">18668023588</span> ,谢谢！</div>'
        this.$vux.alert.show({
          title: '顾客您好',
          content: msg,
          onShow () {
            console.log('Plugin: I\'m showing')
          },
          onHide () {
            console.log('Plugin: I\'m hiding now')
          }
        })
      },
      clearTimer () {
        clearInterval(this.timer)
      }
    },
    mounted () {
      this.setTimer()
    },
    destroyed () {
      this.clearTimer()
    }
  }
</script>

<style scoped lang="less">
  *{
    margin:0;
    padding:0;
  }
  .scrollBox{
    width:100%;
    overflow: scroll;
  }
  ul{
    width:125%;
    overflow: scroll;
  }
  ul li{
    width:20%;
    float: left;
    list-style: none;
    text-align: center;
  }
  ul li img{
    width:40%;
  }
  .top_table tr:nth-child(1) img {
    width: 40%;
  }
  .top_table tr:nth-child(1) td{
    width:25%;
  }
  .main_table td {
    color: #ffffff;
    padding: 5% 0;
    text-align: center;
  }
  .blue {
    background-color: #07C8D6;
  }
  .blue-light {
    background-color: #13DDE2;
  }
  .orange {
    background-color: #FF9D27;
  }
  .orange-light {
    background-color: #F2B057;
  }
  .purple {
    background-color: #813ACC;
  }
  .purple-light {
    background-color: #915FE0;
  }
  .green {
    background-color: rgb(102,204,102);
  }
  .yellow {
    background-color: rgb(255,153,0);
  }
  .red {
    background-color: #FC442B;
  }
  .red-light {
    background-color: #F26953;
  }
</style>
