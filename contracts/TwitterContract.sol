// SPDX-License-Identifier: MIT

pragma solidity  >=0.8.4 <0.9.0;

/**
 * @title Twitter Contract
 * @dev store & retrieve value in a variable
 */
contract TwitterContract {
  event AddTweet(address recipient, uint256 tweetId, uint256 timestamp);
  event DeleteTweet(uint256 tweetId, bool isDeleted);

  struct Tweet {
    uint256 id;
    address username;
    string tweetText;
    uint256 timestamp;
    bool isDeleted;
  }

  Tweet[] private tweets;

  mapping(uint256 => address) tweetToOwner;

  function addTweet(string memory tweetText, uint256 timestamp, bool isDeleted) external {
    uint256 tweetId = tweets.length;
    tweets.push(Tweet(tweetId, msg.sender, tweetText, timestamp, isDeleted));
    tweetToOwner[tweetId] = msg.sender;
    emit AddTweet(msg.sender, tweetId, timestamp);
  }

  function getListTweets() external view returns (Tweet[] memory) {
    Tweet[] memory temporary = new Tweet[](tweets.length);
    uint256 counter = 0;
    for(uint i = 0; i < tweets.length; i++) {
      if (tweets[i].isDeleted == false) {
        temporary[counter] = tweets[i];
        counter++;
      }
    }

    Tweet[] memory result = new Tweet[](counter);
    for(uint i = 0; i < counter; i++) {
      result[i] = temporary[i];
    }
    return result;
  }

  function getMyTweets() external view returns (Tweet[] memory) {
    Tweet[] memory temporary = new Tweet[](tweets.length);
    uint256 counter = 0;
    for(uint i = 0; i < tweets.length; i++) {
      if (tweetToOwner[i] == msg.sender && tweets[i].isDeleted == false) {
        temporary[counter] = tweets[i];
        counter++;
      }
    }

    Tweet[] memory result = new Tweet[](counter);
    for(uint i = 0; i < counter; i++) {
      result[i] = temporary[i];
    }
    return result;
  }

  function getTweet(uint256 tweetId) external view returns (Tweet memory) {
    Tweet memory temporary = tweets[tweetId];
    if (temporary.isDeleted)
      revert('Tweet does not exists.');
    return temporary;
  }

  function deleteTweet(uint256 tweetId, bool isDeleted) external {
    if (tweetToOwner[tweetId] != msg.sender)
      revert('Address does not have permission to perform this action');

    tweets[tweetId].isDeleted = isDeleted;
    emit DeleteTweet(tweetId, isDeleted);
  }
}
