import Vue from 'vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
require('dayjs/locale/th')
dayjs.extend(relativeTime)

Vue.filter('display_address', function (value) {
  if (!value) return '-'
  return value.substring(0, 5) + '...' + value.substring(value.length - 4)
})

Vue.filter('time_ago', function(value) {
  const date = dayjs.unix(value)
  if (!date.isValid()) return '-'
  return date.locale('th').fromNow()
})
