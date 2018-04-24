<template>
  <table
    :class="{table: true, striped: striped === '' ? true : striped}"
  >
    <colgroup>
      <col :width="headerWidth">
      <col
        v-for="item in data"
      >
    </colgroup>
    <tbody>
    <tr
      v-for="(row, index) in rows"
    >
      <td style="text-align: left;">
        <span style="line-height: 43px; padding-left: 10px; white-space: nowrap; font-weight: bold;">{{row.name}}</span>
      </td>
      <td
        v-for="(val, key) in noEmptyData"
        style="text-align: left; min-width: 60px;"
      >
        <span
          v-html
          class="vux-1px-l"
          style="display: inline-block; width: 100%; height: 100%; padding: 0 10px; word-break: break-all; position: relative;"
        >
          <span style="line-height: 43px;">
          {{val[row.field] ? val[row.field] : (val[row.field] !== 0 ? '&nbsp;' : 0)}}
          </span>
        </span>
      </td>
    </tr>
    </tbody>
  </table>
</template>

<script>
  import LeeTable from './Table'
  import LeeColumn from './Column'

  export default {
    components: {
      LeeTable,
      LeeColumn
    },
    data () {
      return {
      }
    },
    props: {
      data: {
        type: Array,
        default: function () {
          return []
        }
      },
      rows: {
        type: Array,
        default: function () {
          return []
        }
      },
      headerWidth: {
        type: Number,
        default: 70
      },
      striped: {
        type: [String, Boolean],
        default: false
      }
    },
    computed: {
      noEmptyData () {
        return this.data && this.data.length ? this.data : [{}]
      }
    }
  }
</script>

<style scoped>
  .table {
    border-spacing: 0;
    width: 100%;
    border: #dfe6ec solid 0;
    font-size: 12px;
    box-sizing: border-box;
  }
  .table tr {
    box-sizing: border-box;
  }
  .table tr:last-of-type td {
    border-bottom: 1px solid #e6e6e6;
  }
  .table td {
    position: relative;
    box-sizing: border-box;
    border-bottom: 1px solid #E8F3F2;
    height: 44px;
    text-align: center;
    transition: background-color 0.3s;
  }
  .table.striped tr:nth-child(2n) {
    background-color: #F0F7F7;
  }
  .table tr {
    box-sizing: border-box;
  }
  .table span {
    box-sizing: border-box;
  }
</style>
