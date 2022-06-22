<template>
  <div class="twitter-item__wrap">
    <div class="twitter-item__main twitter-item__main--border">
      <div class="twitter-item__bar">
        <div class="main-layout__title" style="font-weight: 700">
          หน้าแรก
        </div>
      </div>
       <div class="twitter-item__content">
        <div class="home-page__box py-3 px-4">
          <div class="d-flex" style="position: relative">
            <div class="mr-3">
              <v-avatar>
                <v-img :src="avatar" width="48" height="48" contain />
              </v-avatar>
            </div>
            <div style="width: 100%">
              <div>
                <v-textarea
                  v-model="tweetText"
                  :rules="[(v) => !!v && v.length < maxTweetLen || 'length']"
                  :rows="2"
                  :counter="maxTweetLen"
                  placeholder="มีอะไรเกิดขึ้นบ้าง"
                  class="tweet-box"
                  auto-grow
                  outlined
                  hide-details
                />
              </div>
              <div class="d-flex align-center pt-3">
                <v-spacer />
                <div v-if="tweetText.length > maxTweetLen" class="text-body-2 error--text px-4">{{ maxTweetLen - tweetText.length  }}</div>
                <v-btn color="blue white--text" :disabled="!tweetText" depressed rounded @click="addTweet">ทวีต</v-btn>
              </div>
            </div>
          </div>
        </div>
        <div class="home-page__feeds">
          <div>
            <template v-for="item, i in feeds">
              <feed-item :key="item.id + '-' + Date.now()" :item="item" @delete="onDelete" />
              <v-divider v-if="i < feeds.length" :key="'divider-' + i" />
            </template>
          </div>
        </div>
       </div>
    </div>
    <div class="twitter-item__sidebar">
      <div class="twitter-item__bar">
        <v-text-field prepend-inner-icon="mdi-magnify" placeholder="ค้นหาทวิตเตอร์" single-line full-width dense rounded filled hide-details />
      </div>
      <div class="twitter-item__content"></div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
// import Twitter from '../artifacts/contracts/TwitterContract.sol/TwitterContract.json'
export default {
  name: 'HomePage',
  data() {
    return {
      tweetText: '',
      maxTweetLen: 300,
      twitterContract: null,
      feeds: [],
      users: {},
    }
  },
  computed: {
    avatar() {
      return this.$store.state.avatar
    },
    address() {
      return this.$store.state.web3.web3.address
    }
  },
  mounted() {
    this.getAllTweets(this.address)
    // this.initTwitterContract()
  },
  methods: {
    initTwitterContract() {
      // if (!window.ethereum) return

      // const provider = new this.$ethers.providers.Web3Provider(window.ethereum)
      // const signer = provider.getSigner()
      // this.twitterContract = new this.$ethers.Contract(
      //   this.$config.contractAddress,
      //   Twitter.abi,
      //   signer
      // )
      // const address = await signer.getAddress()
      // this.getAllTweets(address)
    },
    async getAllTweets(address) {
      try {
        const { address } = await this.$web3.getAccount()
        // console.log(address)
        // if (!this.$twitter) throw new Error('not load smart contract')
        const twitter = this.$web3.twitterContract()
        const tweets = await twitter.getListTweets()
        this.feeds = this.parseTweet(tweets, address)
      } catch (error) {
        console.error(error)
      }
    },
    parseTweet(tweets, address) {
      this.users[address] = this.avatar
      const feeds = tweets.map((x) => {
        if (!this.users[x.username]) this.users[x.username] = '/images/avatars/a-0' + (Math.floor(Math.random() * 9) + 1) + '.png'
        const item = {
          id: Number(x.id),
          tweetText: x.tweetText,
          username: x.username,
          timestamp: Number(x.timestamp),
          isDeleted: x.isDeleted,
          personal: x.username.toLowerCase() === address.toLowerCase(),
          img: this.users[x.username]
        }
        return item
      })
      return feeds.sort((a, b) => b.timestamp - a.timestamp)
    },
    async addTweet() {
      try {
        if (!window.ethereum) return
        const { address } = await this.$web3.getAccount()
        const twitter = this.$web3.twitterContract()
        const timestamp = dayjs().unix()
        const text = this.tweetText.replace( /(<([^>]+)>)/ig, '')
        await twitter.addTweet(text, timestamp, false)
        this.tweetText = ''
        this.getAllTweets(address)
      } catch (error) {
        console.error('Error submitting new Tweet', error)
        // const msg = error.message
        this.$notifier.snackbar('Can not submitted new tweet', 'error')
      }
    },
    async onDelete(item) {
      try {
        if (!window.ethereum) return
        const { address } = await this.$web3.getAccount()
        const twitter = this.$web3.twitterContract()
        await twitter.deleteTweet(item.id, true)
        this.getAllTweets(address)
      } catch (error) {
        console.error('Error submitting new Tweet', error)
        // const msg = error.message
        this.$notifier.snackbar('Can not delete tweet', 'error')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.home-page {
  &__box {
    width: 100%;
    min-height: 128px;
    border-bottom: thin solid rgba(0, 0, 0, 0.12);
  }
  &__feed {

  }
}
</style>
