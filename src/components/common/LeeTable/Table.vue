<script type="text/babel">
  import Column from './Column'
  import '../vue-awesome/icons/check-square-o'
  import '../vue-awesome/icons/square-o'
  import '../vue-awesome/icons/long-arrow-down'
  import '../vue-awesome/icons/long-arrow-up'
  import Scroller from './zynga-scroller'
  import longtap from '../../../directives/longtap'
  import elementResizeEvent, {unbind as unbindElementResizeEvent} from 'element-resize-event'

  export default {
    name: 'table',
    props: {
      data: {
        type: Array,
        'default': function () {
          return []
        },
        validator: function (rows) {
          let hasId = !rows.some(item => item.id === undefined)
          if (!hasId) {
            throw Error('Each row should have an unique id')
          }
          return hasId
        }
      },
      striped: {
        type: [String, Boolean]
      },
      activeClass: {
        type: String,
        'default': 'default_active'
      },
      cellChangeEffect: {
        type: [String, Boolean]
      },
      noHeader: [String, Boolean]
    },
    directives: {
      longtap
    },
    components: {
      Column
    },
    render (createElement) {
      let leftTop = createElement(
        'table',
        [
          createElement(
            'colgroup',
            this.fixedColumns.map((column, $cIndex) => {
              return column.renderColElement.call(this, {createElement, column, $cIndex})
            })
          )
        ].concat(
          this.noHeader !== '' ? [createElement(
            'tr',
            this.fixedColumns.map((column, $cIndex) => {
              return column.renderHeaderCell.call(this, {createElement, column, $cIndex}) // 注意返回vnode
            })
          )] : []
        )
      )

      let rightTop = createElement(
        'table',
        {
          ref: 'rows_fixed',
          style: {
            width: Math.max(this.totalWidth, this.scrollContentWidth) + 'px'
          }
        },
        [
          this.notFixedColumns.map((column, $cIndex) => {
            return column.renderColElement.call(this, {createElement, column, $cIndex})
          })
        ].concat(
          this.noHeader !== '' ? createElement('tr',
            this.notFixedColumns.map((column, $cIndex) => {
              return column.renderHeaderCell.call(this, {createElement, column, $cIndex}) // 注意返回vnode
            })
          ) : []
        )
      )

      let leftBottom = createElement('table',
        {
          ref: 'columns_fixed'
        },
        [
          createElement(
            'colgroup',
            this.fixedColumns.map((column, $cIndex) => {
              return column.renderColElement.call(this, {createElement, column, $cIndex})
            })
          ),
          createElement(
            'tbody',
            this.rows.map((row, $rIndex) => {
              return createElement('tr',
                {
                  'class': {
                    active: this.activeRow && this.activeRow.id === row.id
                  },
                  key: $rIndex
                },
                this.fixedColumns.map((column, $cIndex) => {
                  return column.renderBodyCell.call(this, {createElement, row, column, $rIndex, $cIndex}) // 注意返回vnode
                })
              )
            })
          )
        ]
      )

      let rightBottom = createElement(
        'table',
        {
          style: {
            width: Math.max(this.totalWidth, this.scrollContentWidth) + 'px'
          }
        },
        [
          createElement('colgroup',
            this.notFixedColumns.map((column, $cIndex) => {
              return column.renderColElement.call(this, {createElement, column, $cIndex})
            })
          ),
          createElement('tbody',
            this.rows.map((row, $rIndex) => {
              return createElement('tr',
                {
                  'class': {
                    active: this.activeRow && this.activeRow.id === row.id
                  },
                  key: $rIndex
                },
                this.notFixedColumns.map((column, $cIndex) => {
                  return column.renderBodyCell.call(this, {createElement, row, column, $rIndex, $cIndex})
                })
              )
            })
          )
        ]
      )

      return createElement('div',
        {
          ref: 'table_container',
          'class': {
            table_container: true
          },
          directives: [
            {
              name: 'longtap'
            }
          ]
        },
        [
          createElement('div',
            {
              ref: 'table_head_container',
              'class': {
                table_head_container: true
              }
            },
            [
              createElement('div',
                {
                  ref: 'table_head_left_container',
                  'class': {
                    table_head_left_container: true
                  },
                  style: {
                    width: this.totalFixedWidth + 'px'
                  }
                },
                [
                  leftTop
                ]
              ),
              createElement('div',
                {
                  ref: 'table_head_right_container',
                  'class': {
                    table_head_right_container: true
                  },
                  style: {
                    'margin-left': this.totalFixedWidth + 'px'
                  }
                },
                [
                  rightTop
                ]
              )
            ]
          ),
          createElement('div',
            {
              ref: 'table_body_container',
              'class': {
                table_body_container: true,
                striped: this.striped === '' ? true : this.striped
              },
              style: {
                height: this.scrollContentHeight + 'px',
                'margin-top': this.noHeader !== '' ? '30px' : 0
              }
            },
            [
              createElement('div',
                {
                  ref: 'table_body_left_container',
                  'class': {
                    table_body_left_container: true
                  },
                  style: {
                    width: this.totalFixedWidth + 'px',
                    display: this.rows.length > 0 ? 'block' : 'none'
                  }
                },
                [
                  leftBottom
                ]
              ),
              createElement('div',
                {
                  ref: 'table_body_right_container',
                  'class': {
                    table_body_right_container: true
                  },
                  style: {
                    'margin-left': this.totalFixedWidth + 'px',
                    'display': this.rows.length > 0 ? 'block' : 'none'
                  }
                },
                [
                  rightBottom
                ]
              )
            ].concat(this.rows.length ? [] : this.$slots.empty)
          )
        ]
      )
    },
    data () {
      return {
        columns: [],
        scrollContentWidth: 0,
        scrollContentHeight: 0,
        selection: [],
        containerInnerWidth: 0,
        containerInnerHeight: 'auto',
        activeRow: null,
        currentSortInfo: {
          column: null,
          method: null,
          status: 0 // 0 表示未进行排序
        },
        globalCellEffect: true
      }
    },
    computed: {
      totalFixedWidth () {
        return this.fixedColumns.reduce((width, item) => {
          return width + item.width
        }, 0)
      },
      totalWidth () {
        return this.columns.reduce((width, item) => {
          return width + (item.width || 48)
        }, 0)
      },
      fixedColumns () {
        return this.columns.filter(item => {
          return item.fixed
        })
      },
      notFixedColumns () {
        return this.columns.filter(item => {
          return !item.fixed
        })
      },
      isCheckedAll () {
        return this.selection.length > 0 && this.selection.length === this.rows.length
      },
      rows () {
        switch (this.currentSortInfo.status) {
          case 0: // 未排序
            return this.data.slice(0)
          case 1: // 排序方法的正序排序
            return this.data.slice(0).sort(this.currentSortInfo.method)
          case 2: // 排序方法的逆序排序
            return this.data.slice(0).sort(this.currentSortInfo.method).reverse()
          default:
            return this.data.slice(0)
        }
      }
    },
    methods: {
      onClickHeaderCell ({column}) {
        if (column.type === 'selection') {
          this.checkAll()
        } else {
          if (column.sortable) {
            let defaultSortMethod = function (a, b) {
              return a[column.field] < b[column.field] ? -1 : 1
            }

            this.globalCellEffect = false

            if (column !== this.currentSortInfo.column && this.currentSortInfo.status !== 0) {
              this.currentSortInfo = {
                column: null,
                method: null,
                status: 0
              }
            }

            let status = (this.currentSortInfo.status + 1) % 3
            this.currentSortInfo = {
              column,
              method: status === 0 ? function () {} : (typeof column.sortMethod === 'function' ? column.sortMethod : defaultSortMethod),
              status: status
            }

            this.$nextTick(() => {
              this.globalCellEffect = true
            })
          }
        }
      },
      checkAll () {
        if (this.selection.length >= 0 && this.selection.length < this.rows.length) {
          this.selection = this.rows.slice(0)
        } else {
          this.selection = []
        }
      },
      onClickBodyCell (event, row, column) {
        if (event.target.tagName.match(/input|textarea|select/i)) {
          event.stopPropagation()
          return
        }
        if (column.type === 'selection') {
          this.checkOne(row)
        } else {
          this.$emit('on-tap-cell', {event, row, column})
        }
      },
      checkOne (row) {
        let selectedIndex = this.selection.indexOf(row)
        if (selectedIndex > -1) {
          this.selection.splice(selectedIndex, 1)
        } else {
          this.selection.push(row)
        }
      },
      clearChecked () {
        this.selection = []
      },
      onLongTap (event, row, column) {
        this.$emit('on-longtap-cell', {event, row, column})
      },
      cancelLongTap (event, row, column) {
        this.$emit('on-cancel-longtap', {event, row, column})
      },
      refreshScroll () {
        this.$emit('on-refresh')
        let container = this.$refs['table_container']
        let containerRect = container.getBoundingClientRect()

        this.containerInnerWidth = containerRect.width
        this.containerInnerHeight = containerRect.height

        this.scrollContentWidth = (this.containerInnerWidth - this.totalFixedWidth)
        this.scrollContentHeight = (this.containerInnerHeight - this.$refs['table_head_container'].clientHeight)

        let scrollContainer = this.$refs['table_body_right_container']
        let scrollContent = scrollContainer.firstChild
        let scrollContainerRect = scrollContainer.getBoundingClientRect()
        let contentRect = scrollContent.getBoundingClientRect()

        this.scroller && this.scroller.setPosition(scrollContainerRect.left + scrollContainer.clientLeft, scrollContainerRect.top + scrollContainer.clientTop)
        this.scroller && this.scroller.setDimensions(container.clientWidth + scrollContainerRect.left - this.totalFixedWidth, container.clientHeight + scrollContainerRect.top - 30, contentRect.width + scrollContainerRect.left, contentRect.height + scrollContainerRect.top)
      },
      setRowActive (row) {
        this.activeRow = row
      },
      setRowInactive () {
        this.activeRow = false
      },
      onDomChange (event, row, column) {
        let node = event.currentTarget
        node.style.backgroundColor = '#8492A6'
        setTimeout(function () {
          node.style.backgroundColor = 'transparent'
        }, 300)
      }
    },
    mounted () {
      const _this = this

      this.$nextTick(() => {
        let container = _this.$refs['table_container']

        let docStyle = document.documentElement.style

        let engine
        if (window.opera && Object.prototype.toString.call(opera) === '[object Opera]') {
          engine = 'presto'
        } else if ('MozAppearance' in docStyle) {
          engine = 'gecko'
        } else if ('WebkitAppearance' in docStyle) {
          engine = 'webkit'
        } else if (typeof navigator.cpuClass === 'string') {
          engine = 'trident'
        }

        let vendorPrefix = {
          trident: 'ms',
          gecko: 'Moz',
          webkit: 'Webkit',
          presto: 'O'
        }[engine]

        let transformProperty = vendorPrefix + 'Transform'

        let scrollContainer = _this.$refs['table_body_right_container']
        let scrollContent = scrollContainer.firstChild
        let scrollLeftContainer = _this.$refs['table_body_left_container']
        let scrollLeftContent = scrollLeftContainer.firstChild
        let scrollTopContainer = _this.$refs['table_head_right_container']
        let scrollTopContent = scrollTopContainer.firstChild

        _this.scroller = new Scroller(function (left, top) {
          scrollContent.style[transformProperty] = 'translate3d(' + (-left) + 'px,' + (-top) + 'px,0)'
          scrollLeftContent.style[transformProperty] = 'translate3d(0,' + (-top) + 'px,0)'
          scrollTopContent.style[transformProperty] = 'translate3d(' + (-left) + 'px,' + '0,0)'
        }, {
          scrollingX: true,
          scrollingY: true,
          animating: true,
          animationDuration: 250,
          bouncing: false,
          locking: true,
          paging: false,
          snapping: false,
          zooming: false
        })

        _this.refreshScroll()

        let touchLeft
        let touchTop
        let touchCancel

        function onTouchStart (e) {
          if (e.target.tagName.match(/input|textarea|select/i)) {
            return
          }

          touchCancel = false
          _this.scroller.doTouchStart(e.touches, e.timeStamp)
        }

        function onTouchMove (e) {
          touchCancel = true

          if (e.target.tagName.match(/input|textarea|select/i)) {
            e.stopPropagation()
          } else {
            e.preventDefault()
          }
          _this.scroller.doTouchMove(e.touches, e.timeStamp)
        }

        function containerTouchEnd (e) {
          if (touchCancel) {
            if (e.target.tagName.match(/input|textarea|select/i)) {
              e.stopPropagation()
            } else {
              e.preventDefault()
            }
          }
          if (touchLeft) {
            _this.scroller.setScrollingX(true)
            touchLeft = false
          }
          if (touchTop) {
            _this.scroller.setScrollingY(true)
            touchTop = false
          }
          _this.scroller.doTouchEnd(e.timeStamp)
        }

        function scrollLeftContainerTouchStart (e) {
          touchCancel = false
          touchLeft = true
          _this.scroller.setScrollingX(false)
          _this.scroller.doTouchStart(e.touches, e.timeStamp)
        }
        function scrollTopContainerTouchStart (e) {
          touchCancel = false
          touchTop = true
          _this.scroller.setScrollingY(false)
          _this.scroller.doTouchStart(e.touches, e.timeStamp)
        }

        scrollContainer.addEventListener('touchstart', onTouchStart, false)
        container.addEventListener('touchmove', onTouchMove, false)
        container.addEventListener('touchend', containerTouchEnd, false)

        scrollLeftContainer.addEventListener('touchstart', scrollLeftContainerTouchStart, false)
        scrollTopContainer.addEventListener('touchstart', scrollTopContainerTouchStart, false)

        this.destroyScroller = function () {
          scrollContainer.removeEventListener('touchstart', onTouchStart)
          container.removeEventListener('touchstart', onTouchMove)
          container.removeEventListener('touchend', containerTouchEnd)
          scrollLeftContainer.removeEventListener('touchstart', scrollLeftContainerTouchStart)
          scrollLeftContainer.removeEventListener('touchstart', scrollTopContainerTouchStart)
        }
      })
    },
    watch: {
      data: {
        immediate: true,
        handler: function (rows) {
          if (rows.length) {
            this.selection = this.selection.filter(item => {
              return rows.indexOf(item) > -1
            })

            this.$nextTick(() => {
              this.refreshScroll()
            })
          }
        }
      },
      selection: function (val) {
        this.$emit('selection-change', val)
      }
    },
    created () {
      elementResizeEvent(document.body, () => {
        this.refreshScroll()
      })
      let columns = []

      // 遍历 column 子元素
      this.$slots.default.map(vnode => {
        let columnConfig = vnode.props
        // 过滤非 column 的节点
        if (columnConfig && columnConfig.__name === 'column') {
          // 取出子元素的 props
          columnConfig.width = Math.max(columnConfig.width, 48)
          columnConfig.fixed = columnConfig.fixed === '' ? true : columnConfig.fixed
          columnConfig.type = columnConfig.type === '' ? 'default' : columnConfig.type
          columnConfig.sortable = columnConfig.sortable === '' ? true : columnConfig.sortable
          columnConfig.changeEffect = columnConfig.changeEffect === '' ? true : columnConfig.changeEffect

          /**
           * 渲染col元素
           * @param createElement
           * @param column
           * @param $cIndex
           * @returns {Element|*|VNode}
           */
          columnConfig.renderColElement = ({createElement, column, $cIndex}) => {
            return createElement('col',
              {
                domProps: {
                  width: column.width
                },
                key: $cIndex
              }
            )
          }

          /**
           * 渲染表头的cell
           * @param createElement
           * @param column
           * @param $cIndex
           * @returns {*}
           */
          columnConfig.renderHeaderCell = ({createElement, column, $cIndex}) => {
            return createElement('th',
              {
                style: {
                  'text-align': column.headerAlign ? column.headerAlign : 'center'
                },
                on: {
                  click: () => this.onClickHeaderCell({column})
                },
                key: $cIndex
              },
              [
                columnConfig.type === 'selection' ? createElement('icon',
                  {
                    props: {
                      name: this.isCheckedAll ? 'check-square-o' : 'square-o'
                    },
                    style: {
                      'vertical-align': 'middle'
                    }
                  }
                ) : columnConfig.sortable ? createElement('div',
                  [
                    column.label
                  ].concat(
                    this.currentSortInfo.status === 0 ? [] : (this.currentSortInfo.column === column ? createElement('icon',
                      {
                        props: {
                          name: ['long-arrow-down', 'long-arrow-up'][this.currentSortInfo.status - 1],
                          scale: 0.75
                        },
                        style: {
                          'padding-left': '5px',
                          'vertical-align': 'middle'
                        }
                      }
                    ) : [])
                  )
                ) : column.label
              ]
            )
          }

          /**
           * 渲染表单内容的cell
           * @param createElement
           * @param row
           * @param column
           * @param $cIndex
           * @returns {*}
           */
          columnConfig.renderBodyCell = ({createElement, row, column, $cIndex}) => {
            let isChecked = this.selection.indexOf(row) > -1
            let fieldValue = columnConfig.formatter ? columnConfig.formatter(row[column.field]) : row[column.field]

            return createElement('td',
              {
                'class': {
                  [this.activeClass]: isChecked
                },
                style: {
                  'text-align': column.align ? column.align : 'center'
                },
                on: {
                  click: (event) => { this.onClickBodyCell(event, row, column) },
                  longtap: (event) => { this.onLongTap(event, row, column) },
                  cancellongtap: () => { this.cancelLongTap(event, row, column) },
                  DOMSubtreeModified: (event) => { if (this.globalCellEffect && column.changeEffect) { this.onDomChange(event, row, column) } }
                },
                key: $cIndex
              },
              [columnConfig.type === 'selection' ? createElement('icon',
                {
                  props: {
                    name: isChecked ? 'check-square-o' : 'square-o'
                  },
                  style: {
                    'vertical-align': 'middle'
                  }
                }
              ) : (vnode.data.scopedSlots ? vnode.data.scopedSlots.default({
                fieldValue: fieldValue,
                row: row
              }) : fieldValue)
              ]
            )
          }

          columns.push(columnConfig)
        }
      })

      this.columns = columns
    },
    destroyed () {
      try {
        unbindElementResizeEvent(document.body)
      } catch (e) {
      }
    }
  }
</script>

<style scoped lang="less">
  .default_active {
    background-color: rgba(0, 0, 0, 0.05) !important;
  }
  .table_container {
    position: relative;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    overflow: hidden;
    font-size: 12px;
    user-select: none;
    table {
      /*border-collapse: collapse;*/
      border-spacing: 0;
      width: 100%;
      border: #dfe6ec solid 0;
      tr {
        box-sizing: border-box;
      }
      tr:last-of-type td {
        border-bottom: 1px solid #e6e6e6;
      }
      th {
        position: relative;
        background: #E8F7F7;
        color: #2c3e50;
        white-space: nowrap;
        height: 30px;
        border-top: 2px solid #8AA9AE;
        border-bottom: 1px solid #8AA9AE;
        box-sizing: border-box;
        border-left: 0;
      }
      td {
        position: relative;
        box-sizing: border-box;
        border-bottom: 1px solid #E8F3F2;
        height: 44px;
        text-align: center;
        transition: background-color .3s;
      }
    }
    .table_head_container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      box-sizing: border-box;
      .table_head_left_container {
        position: absolute;
        left: 0;
        top: 0;
      }
      .table_head_right_container {
        position: relative;
        overflow: hidden;
      }
    }
    .table_body_container {
      position: relative;
      width: 100%;
      box-sizing: border-box;
      &.striped tr:nth-child(2n) {
        background-color: #F0F7F7;
      }
      tr.active {
        background-color: rgba(0, 0, 0, 0.05) !important;
        color: @theme-color;
      }
      .table_body_left_container {
        position: absolute;
        height: 100%;
        overflow: hidden;
        left: 0;
        top: 0;
      }
      .table_body_right_container {
        height: 100%;
        position: relative;
        overflow: hidden;
      }
    }
  }
</style>
