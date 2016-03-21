var path = require('path');
var url = 'file://' + path.join(__dirname, '..', '..', 'index.html');

var users = {};
var invalidStrings = [Math.floor(Math.random() * 10), true, null, undefined, function() {}, {}, [], ''];

function switchUser(client, user) {
  return client
    .setValue('input[type=text]#switch-user-input', user)
    .pause(1000)
    .click('button#switch-user-button')
    .pause(1000)
}

function tweet(client, content) {
  return client
    .setValue('textarea#tweet-input', content)
    .pause(1000)
    .click('button#tweet-button')
    .pause(1000);
}

function follow(client, user) {
  return client
    .setValue('input[type=text]#follow-input', user)
    .pause(1000)
    .click('button#follow-button')
    .pause(1000);
};

function random() {
  do { 
    var name = 'random.name' + Math.floor(Math.random() * 100000);
  } while(users.hasOwnProperty(name));
  users[name] = true;
  return name;
}

describe('twitter', function() {
  var randomUser1;
  var randomUser2;
  var randomUser3;

  beforeEach(function(client, done) {
    randomUser1 = random();
    randomUser2 = random();
    randomUser3 = random();
    client
      .url(url)
      .pause(1000);
    switchUser(client, randomUser1);
    done();
  });
  after(function(client, done) {
    client.end(function() {
      done()
    });
  });
  it('shows correct username', function(client) {
    client.expect.element('#current-user-header').text.to.equal(randomUser1);
  });
  it('shows no following on new user', function(client) {
    client.expect.element('#following-list a').not.to.be.present;
  });
  it('shows no followers on new user', function(client) {
    client.expect.element('#follower-list a').not.to.be.present;
  });
  it('shows no tweets on a new user', function(client) {
    client.expect.element('#tweet-list .tweet').not.to.be.present;
  });
  describe('switchUser()', function() {
    it('clears switch user input', function(client) {
      client.expect.element('input[type=text]#switch-user-input').to.have.value.that.equals('');
    });
    it('can switch users with following links', function(client) {
      follow(client, randomUser2);
      client.expect.element('#following-list a').to.be.present;
      client.click('#following-list a')
        .pause(1000)
        .expect.element('#current-user-header').text.to.equal(randomUser2);
    });
    it('can switch users with follower links', function(client) {
      follow(client, randomUser2);
      switchUser(client, randomUser2);
      client.expect.element('#follower-list a').to.be.present;
      client.click('#follower-list a')
        .pause(1000)
        .expect.element('#current-user-header').text.to.equal(randomUser1);
    });
  });
  describe('follow()', function() {
    beforeEach(function(client, done) {
      follow(client, randomUser2);
      done();
    });
    it('clears follow input', function(client) {
      client.expect.element('input[type=text]#follow-input').to.have.value.that.equals('');
    });
    it('adds followed user to follower list', function(client) {
      client.expect.element('#following-list a').text.to.be.equal(randomUser2);
    });
    it('adds current user to following list of followed user', function(client) {
      switchUser(client, randomUser2);
      client.expect.element('#follower-list a').text.to.be.equal(randomUser1);
    });
    it('returns tweets from another user after following them', function(client) {
      switchUser(client, randomUser2);
      tweet(client, 'Hello!');
      switchUser(client, randomUser1);
      client.expect.element('#tweet-list .tweet .tweet-username').text.to.equal(randomUser2);
      client.expect.element('#tweet-list .tweet .tweet-content').text.to.equal('Hello!');
    });
    it('returns tweets from another user after multiple users follow them', function(client) {
      switchUser(client, randomUser3);
      follow(client, randomUser2);
      switchUser(client, randomUser2);
      tweet(client, 'Hello my multiple friends!');
      switchUser(client, randomUser1);
      client.expect.element('#tweet-list .tweet .tweet-username').text.to.equal(randomUser2);
      client.expect.element('#tweet-list .tweet .tweet-content').text.to.equal('Hello my multiple friends!');
      switchUser(client, randomUser3);
      client.expect.element('#tweet-list .tweet .tweet-username').text.to.equal(randomUser2);
      client.expect.element('#tweet-list .tweet .tweet-content').text.to.equal('Hello my multiple friends!');
    });
    it('returns tweets from multiple users after following them', function(client) {
      follow(client, randomUser3);
      switchUser(client, randomUser2);
      tweet(client, 'I like Twitter');
      switchUser(client, randomUser3);
      tweet(client, 'So do I');
      switchUser(client, randomUser1);
      tweet(client, 'Meh');
      client.expect.element('#tweet-list .tweet:nth-child(1) .tweet-username').text.to.equal(randomUser1);
      client.expect.element('#tweet-list .tweet:nth-child(1) .tweet-content').text.to.equal('Meh');
      client.expect.element('#tweet-list .tweet:nth-child(2) .tweet-username').text.to.equal(randomUser3);
      client.expect.element('#tweet-list .tweet:nth-child(2) .tweet-content').text.to.equal('So do I');
      client.expect.element('#tweet-list .tweet:nth-child(3) .tweet-username').text.to.equal(randomUser2);
      client.expect.element('#tweet-list .tweet:nth-child(3) .tweet-content').text.to.equal('I like Twitter');
    });
    it('does not return past tweets when following', function(client) {
      tweet(client, 'You won\'t see this');
      switchUser(client, randomUser2);
      follow(client, randomUser1)
        .expect.element('#tweet-list .tweet').not.to.be.present;
    });
  });
  describe('tweet()', function() {
    it('clears input after tweeting', function(client) {
      tweet(client, 'a tweet');
      client.expect.element('textarea#tweet-input').to.have.value.that.equals('');
    });
    it('shows tweet on my own timeline', function(client) {
      tweet(client, 'This is my own tweet');
      client.expect.element('#tweet-list .tweet .tweet-content').text.to.equal('This is my own tweet');
      client.expect.element('#tweet-list .tweet .tweet-username').text.to.equal(randomUser1);
    });
    it('adds multiple tweets in the correct order', function(client) {
      tweet(client, 'My first tweet');
      tweet(client, 'My second tweet');
      client.expect.element('#tweet-list .tweet:nth-child(1) .tweet-content').text.to.equal('My second tweet');
      client.expect.element('#tweet-list .tweet:nth-child(1) .tweet-username').text.to.equal(randomUser1);
      client.expect.element('#tweet-list .tweet:nth-child(2) .tweet-content').text.to.equal('My first tweet');
      client.expect.element('#tweet-list .tweet:nth-child(2) .tweet-username').text.to.equal(randomUser1);
    });
  });
});