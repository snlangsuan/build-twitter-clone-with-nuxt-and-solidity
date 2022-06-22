const expect  = require('chai').expect
const dayjs = require('dayjs')
const ethers = require('hardhat').ethers

describe('Twitter Contract', function() {

  const NUM_TOTAL_NOT_MY_TWEETS = 5
  const NUM_TOTAL_MY_TWEETS = 3

  const totalTweets = []
  const totalMyTweets = []

  beforeEach(async function () {
    const TwitterContract = await ethers.getContractFactory('TwitterContract')
    const address = await ethers.getSigners()
    this.owner = address[0]
    this.addr1 = address[1]
    this.twitter = await TwitterContract.deploy()

    for (let i = 0; i < NUM_TOTAL_NOT_MY_TWEETS; i++) {
      const tweet = {
        tweetText: 'Random text with id: #' + i,
        username: this.addr1,
        timestamp: dayjs().unix(),
        isDeleted: false
      }
      await this.twitter.connect(this.addr1).addTweet(tweet.tweetText, tweet.timestamp, tweet.isDeleted)
      totalTweets.push(tweet)
    }

    for (let i = 0; i < NUM_TOTAL_MY_TWEETS; i++) {
      const tweet = {
        tweetText: 'Random text with id: #' + (NUM_TOTAL_NOT_MY_TWEETS + i),
        username: this.owner,
        timestamp: dayjs().unix(),
        isDeleted: false
      }
      await this.twitter.addTweet(tweet.tweetText, tweet.timestamp, tweet.isDeleted)
      totalTweets.push(tweet)
      totalMyTweets.push(tweet)
    }
  })

  describe('Add Tweet', function() {
    it('should emit AddTweet event', async function() {
      const tweet = {
        tweetText: 'New Tweet',
        timestamp: dayjs().unix(),
        isDeleted: false
      }
      const res = await this.twitter.addTweet(tweet.tweetText, tweet.timestamp, tweet.isDeleted)
      const rc = await res.wait()
      const event = rc.events.find(event => event.event === 'AddTweet')
      const [recipient, tweetId, timestamp] = event.args
      expect(recipient).to.equal(this.owner.address)
      expect(Number(tweetId)).to.equal(NUM_TOTAL_NOT_MY_TWEETS + NUM_TOTAL_MY_TWEETS)
      expect(Number(timestamp)).to.equal(tweet.timestamp)
    })
  })

  describe('Get List Tweets', function() {
    it('should return the correct number of total tweets', async function() {
      const tweetsFromChain = await this.twitter.getListTweets()
      expect(tweetsFromChain.length).to.equal(NUM_TOTAL_NOT_MY_TWEETS + NUM_TOTAL_MY_TWEETS)
    })

    it('should return the correct number of all my tweets', async function() {
      const myTweetsFromChain = await this.twitter.getMyTweets()
      expect(myTweetsFromChain.length).to.equal(NUM_TOTAL_MY_TWEETS)
    })
  })

  describe('Delete Tweet', function() {
    it('should emit delete event', async function() {
      const TWEET_ID = 0
      const TWEET_DELETED = true

      const res = await this.twitter.connect(this.addr1).deleteTweet(TWEET_ID, TWEET_DELETED)
      const rc = await res.wait()
      const event = rc.events.find(event => event.event === 'DeleteTweet')
      const [tweetId, isDeleted] = event.args
      expect(Number(tweetId)).to.equal(TWEET_ID)
      expect(isDeleted).to.equal(TWEET_DELETED)
    })
  })
})
