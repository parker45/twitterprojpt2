var commands = {
  tweet: function(content) {
    return this.setValue('@tweetInput', content)
      .click('@tweetButton');
  },
  follow: function(name) {
    return this.setValue('@followInput', name)
      .click('@followButton');
  },
  switchUser: function(name) {
    this.setValue('@switchUserInput');
    this.api.pause(1000);
    return this.click('@switchUserButton');
  }
};

module.exports = {
  commands: [commands],
  elements: {
    currentUserHeader: '#current-user-header',
    switchUserInput: 'input[type=text]#swich-user-input',
    switchUserButton: 'button#switch-user-button',
    tweetInput: 'textarea#tweet-input',
    tweetButton: 'button#tweet-button',
    followInput: 'input[type=text]#follow-input',
    followButton: 'button#follow-button',
    tweetList: '#tweet-list',
    tweets: '#tweet-list .tweet',
  },
  sections: {
    tweetList: {
      selector: '#tweet-list',
      elements: {
        tweets: '.tweet',
        user: '.tweet .tweet-username',
        content: '.tweet .tweet-content'
      }
    },
    followerList: {
      selector: '#follower-list',
      elements: {
        user: 'a'
      }
    },
    followingList: {
      selector: '#following-list',
      elements: {
        user: 'a'
      }
    }
  }
};
