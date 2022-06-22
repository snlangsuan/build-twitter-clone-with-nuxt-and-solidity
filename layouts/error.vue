<template>
  <v-container fill-height>
    <v-row align="center" justify="center" fill-height>
      <div class="d-inline">
        <div
          class="text-h1 font-weight-bold text-center grey--text text--lighten-2"
        >
          {{ status }}
        </div>
        <div class="text-center pt-3 font-weight-light">
          {{ message }}
        </div>
      </div>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'ErrorLayout',
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      statusMessages: {
        401: {
          title: 'Unauthorized',
          message:
            'จำเป็นต้องลงชื่อเพื่อเข้าใช้งานก่อน หากมีข้อสงสัยติดต่อผู้ดูแลระบบ',
        },
        403: {
          title: 'Access Denied',
          message:
            'คุณไม่สามารถเข้าถึงทรัพยากรได้ หากมีข้อสงสัยติดต่อผู้ดูแลระบบ',
        },
        404: {
          title: '404 Not Found',
          message: 'ขอโทษด้วยนะ เราไม่พบหน้าที่คุณต้องการ',
        },
        415: {
          title: 'Unsupported Media Type',
          message: 'ไม่รองรับการทำงานบนอุปกรณ์หรือเว็บเบราว์เซอร์',
        },
        500: {
          title: 'An error occurred',
          message: 'เรากำลังปรับปรุงเพื่อสิ่งที่ดีกว่า และเราจะกลับมาในไม่ช้า',
        },
        503: {
          title: 'An error occurred',
          message: 'เรากำลังปรับปรุงเพื่อสิ่งที่ดีกว่า และเราจะกลับมาในไม่ช้า',
        },
      },
    }
  },
  head() {
    return {
      title: this.title,
    }
  },
  computed: {
    status() {
      return this.error.statusCode in this.statusMessages
        ? this.error.statusCode
        : 500
    },
    message() {
      return this.statusMessages[this.status].message
    },
    title() {
      return this.statusMessages[this.status].title
    },
  },
  mounted() {
    window.onbeforeunload = null
  }
}
</script>
