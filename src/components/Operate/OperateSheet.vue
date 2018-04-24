<template>
  <div>
    <view-box body-padding-top="46px" body-padding-bottom="0" style="width: 100%;height: 100%; overflow: hidden;">
      <x-header style="width:100%;">工艺计划单<a slot="right" style="width: 70px;height: 44px;line-height: 44px;margin-top: -13px;margin-right: -14px;">确定</a></x-header>
      <div style="position: absolute; bottom: 60px; width: 100%;">
        <!--<div class="space-btn" @click="spaceChange">显示间隔</div>-->
        <!--<div class="space" v-if="showSpace">间隔</div>-->
        <!--<p v-for="i in 11">{{i}}<br></p>-->
        <group title="without title">
          <selector placeholder="请选择省份" v-model="demo02" :options="list"></selector>
        </group>
        <div style="height:44px;">
          <sticky
            scroll-box="vux_view_box_body"
            ref="sticky"
            :offset="46"
            :check-sticky-support="false"
            :disabled="disabled">
            <tab :line-width="1">
              <tab-item selected>正在正映</tab-item>
              <tab-item>即将上映</tab-item>
            </tab>
          </sticky>
        </div>
      </div>
      <!--<x-header
        slot="header"
        title="工艺计划单"
        :leftOptions="{showBack: true}"
        :rightOptions="{showMore: false, preventDefault: true}"
        style="width:100%;position:absolute;left:0;top:0;z-index:100;"
        class="sh_header"
      >
        <div
          slot="right"
          @click="onMenuClick"
          style="width: 70px;height: 44px;line-height: 44px;margin-top: -13px;margin-right: -14px;"
        >确定</div>
      </x-header>-->
    </view-box>
  </div>
</template>

<script>
  import { XHeader,Tab,TabItem,Group} from 'vux'
  import { LeeTable, LeeColumn } from '../common/LeeTable/index'

  export default {
      name: "OpearateSheet",
      components: {
        XHeader,
        LeeTable,
        LeeColumn,
        Tab,
        TabItem,
        Group
      },
    }
</script>

<style scoped>
/*  .overwrite-title-demo {
    margin-top: 5px;
  }*/
</style>
