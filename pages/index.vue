<template>
  <div class="login-page">
    <div class="login-page-item login-page__canvas">
      <svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path></g></svg>
    </div>
    <div class="login-page-item d-flex align-center justify-center">
      <div class="login-page-box">
        <div class="login-page-box__logo">
          <svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path></g></svg>
        </div>
        <div class="login-page-box__title">
          เกิดขึ้นตอนนี้
        </div>
        <div class="login-page-box__subtitle">
          เข้าร่วมทวิตเตอร์วันนี้
        </div>
        <div class="login-page-box__button">
          <div>
            <v-btn color="blue white--text" :disabled="!canLogin" raised rounded @click="onSignIn">
              <metamask-logo />
              เชื่อมต่อกับกระเป๋า MetaMask
            </v-btn>
          </div>
          <div class="login-page-box__error">
            <div class="login-page-box__error-text">{{ errorMessage }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
  layout: 'login',
  data() {
    return {
      canLogin: false,
      errorMessage: '',
    }
  },
  computed: {
    web3() {
      return this.$store.state.web3.web3
    }
  },
  mounted() {
    this.canLogin = 'ethereum' in window
    if (!this.canLogin) {
      this.errorMessage = 'กรุณาติดตั้งกระเป๋า MetaMask'
    }
    if (window.ethereum && window.ethereum.isConnected()) {
      this.onSignIn()
    }
  },
  methods: {
    async onSignIn() {
      try {
        await this.$web3.login()
        console.log('check login')
        this.$router.replace({ path: '/home' })
      } catch (error) {
        console.error(error)
        if (error.code === 4001) {
          this.errorMessage = 'ไม่สามารถเชื่อมต่อกับกระเป่า MetaMask เนื่องจากยกเลิกโดยผู้ใช้'
        } else if (error.code === '-32002') {
          if (window.ethereum) {
            window.ethereum.on('accountsChanged', () => {
              this.onSignIn()
            })
          }
        } else {
          this.errorMessage = error.message
        }
        // this.$notifier.snackbar(msg, 'error')
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.login-page {
  height: 100%;
  display: flex;
  & > * {
    flex: 1;
  }

  &-item {
    position: relative;
    padding: 16px;
  }

  &__canvas {
    background-image: url('/images/lohp_1302x955.png');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;

    & > svg {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      width: 100%;
      max-height: 380px;
      height: 50%;
      fill: #ffffff;
      padding: 32px;
    }
  }
  &-box {
    padding: 20px;
    min-width: 437px;
    max-width: 760px;
    width: 100%;
    &__logo {
      & > svg {
        width: 45px;
        height: 45px;
        padding-bottom: 12px;
        fill: rgb(29, 155, 240);
      }
    }
    &__title {
      line-height: 84px;
      letter-spacing: -1.2px;
      font-size: 64px;
      font-weight: 700;
      margin: 48px 0;
    }
    &__subtitle {
      line-height: 36px;
      font-size: 31px;
      font-weight: 700;
      margin-bottom: 32px;
    }
    &__button {
      height: 120px;
      display: flex;
      flex-direction: column;
      // align-items: center;
      justify-content: center;
    }
    &__error {
      min-height: 24px;
      margin-top: 12px;
      margin-bottom: 12px;

      &-text {
        font-weight: 200;
        color: rgb(244, 33, 46);
      }
    }
  }
}
</style>
