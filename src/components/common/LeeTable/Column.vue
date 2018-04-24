<script type="text/babel">
  export default {
    functional: true,
    name: 'column',
    props: {
      __name: {
        type: String,
        default: 'column'
      },
      type: {
        type: String,
        default: 'default'
      },
      label: String,
      className: String,
      labelClassName: String,
      property: String,
      field: String,
      width: {
        type: Number,
        default: 0
      },
      minWidth: {
        type: Number,
        default: 44
      },
      sortable: {
        type: Boolean,
        default: false
      },
      sortMethod: Function,
      align: String,
      headerAlign: String,
      fixed: {
        type: Boolean,
        default: false
      },
      formatter: Function,
      rowIndex: [Number, String],
      fieldValue: [Object, String, Number, Boolean],
      row: Object,
      changeEffect: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {}
    },
    render (createElement, context) {
      return context
    }
  }
</script>

<style>
  .table-cell {
    max-height: 44px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
