

/*
* @module Twitter
* This module contains 6 functions which need to be implemented. Each function
* has comments defining the inputs and outputs of each function. Modify this
* file as needed to complete the assignemtn howver DO NOT modify the function
* signatures or the module.exports at the bottom of the file.
*/

var users = {};

function isValidString(user) {
  return typeof user === 'string' && user !== '';
}

function isSignedUp(user) {
  return users.hasOwnProperty(user);
}

/*
* @function
* @name signup
* The signup function adds a new user to twitter. Users must be signed up
* before being used in any of the other functions.
*
* @param   {string} user   The user to signup.
*/
function signup(user) {
  if(!isValidString(user) || isSignedUp(user)) {
    return false;
  }
  users[user] = {
    timeline: [],
    followers: [],
    following: [],
  };
  return true;
}

/*
 * @function
 * @name timeline
 * The timeline function will return an array of tweets representing the
 * timeline for a given user.
 *
 * @param   {string} user   The user whose timeline to return.
 * @returns {[]|false}     Array of tweet objects representing the timeline
 * of the user. Alternatively, false will be returned if the user is not a
 * valid string.
 */
function timeline(user) {
  if(!isValidString(user) || !isSignedUp(user)) {
    return false;
  }

  return users[user].timeline;
}

/*
 * @function
 * @name follow
 * The follow function allows the follower to receive future tweets from the
 * user.
 *
 * @param   {string} follower The user requesting to follow the user.
 * @param   {string} user     The user being followed.
 * @returns {boolean}         Returns true if successfully followed and false
 * if not.
 */
function follow(follower, user) {
  if(!isValidString(follower) || !isSignedUp(follower)) {
    return false;
  }
  if(!isValidString(user) || !isSignedUp(user)) {
    return false;
  }
  if(follower === user) {
    return false;
  }
  if(users[follower].following.indexOf(user) !== -1) {
    return false;
  }
  users[follower].following.push(user);
  users[user].followers.push(follower);
  return true;
}

/* @function
 * @name unfollow
 * The unfollow function is the inverse of {@link follow}. After unfollowing,
 * future tweets from user will not show up in follower's timeline.
 *
 * @param   {string} follower The user requesting to follow the user.
 * @param   {string} user     The user being followed.
 * @returns {boolean}         Returns true if successfully unfollowed and false
 * if not.
 */
function unfollow(follower, user) {
  if(!isValidString(follower) || !isSignedUp(follower)) {
    return false;
  }
  if(!isValidString(user) || !isSignedUp(user)) {
    return false;
  }
  if(follower === user) {
    return false;
  }
  if(users[follower].following.indexOf(user) === -1) {
    return false;
  }
  users[follower].following.splice(users[follower].following.indexOf(user), 1);
  users[user].followers.splice(users[user].following.indexOf(follower), 1);
  return true;
}

/*
 * @function
 * @name tweet
 * This function will add a tweet for a given user. Tweeting will add a tweet
 * to each followers timeline, including the user doing the tweeting.
 *
 * @param   {string} user     The user tweeting.
 * @param   {string} content  The tweet content.
 * @returns {{}}|false}     Returns a tweet object or false in the case of a
 * failure.
 */
function tweet(user, content) {
  if(!isValidString(user) || !isSignedUp(user)) {
    return false;
  }
  if(!isValidString(content) || content.length > 140) {
    return false;
  }
  var tweetObject = {
    id: 100000 + Math.floor((Math.random() * 100000)),
    username: user,
    content: content,
    date: (new Date).toISOString(),
    retweet: false,
    favorites: 0
  };

  users[user].timeline.unshift(tweetObject);

  for(var i = 0; i < users[user].followers.length; i++) {
    var follower = users[user].followers[i];
    users[follower].timeline.unshift(tweetObject);
  }
  return tweetObject;
}

var currentUser;
var followerInput;
var tweetInput;
var switchUserButton;
var switchUserInput;
var followButton;
var tweetButton;
var followersList;
var followingList;
var timelineList;
var currentUserHeader;
var unfollowButton;
var count;

function switchUser(e){
  if(isValidString(switchUserInput.value) && switchUserInput.value !== currentUser){
    currentUser = switchUserInput.value;
    if(!isSignedUp(currentUser)){
      signup(currentUser);
      currentUserHeader.innerText = currentUser;
    }
    currentUserHeader.innerText = currentUser;
    displayTimeline(currentUser);
    displayFollowing(currentUser);
    displayFollowers(currentUser);
    switchUserInput.value = '';
  }
  else {
    alert('Enter a valid username');
    switchUserInput.value = '';
    return false;
  }
}

//displays the timeline array for a user using the creatTweet method
function displayTimeline(user) {
  if(isValidString(user) && isSignedUp(user)) {
    while (timelineList.firstChild) {
      timelineList.removeChild(timelineList.firstChild);
    }
    var timeline = users[user].timeline;
    for (var i = 0; i < timeline.length; i++) {
      var tweet = createTweet(timeline[i].username, timeline[i].content);
      registerRetweet(tweet.childNodes[2]);
      timelineList.appendChild(tweet);
    }
  }
}
//adds the tweet to the timeline
function addTweet(e){
  if(tweetInput.value && tweetInput.value.length <= 140 && isSignedUp(currentUser)){
    tweet(currentUser, tweetInput.value);
    displayTimeline(currentUser);
    tweetInput.value = '';
    count.innerHTML = '';
  }
  else{
    alert('Please enter a valid username or tweet');
    tweetInput.value = '';
    count.innerHTML = '';
    return false;
  }
}
//creates the actual HTML for the tweet
function createTweet(username, content) {

  var li = document.createElement('li');
  li.className = 'list-group-item tweet animated slideInDown';

  //li.id = 'tweet';


  var tweetUsername = document.createElement('p');
  tweetUsername.className = 'tweet-username';
  tweetUsername.innerText = username;
  var tweetContent = document.createElement('p');
  tweetContent.className = 'tweet-content';
  tweetContent.innerText = content;
  var retweet = document.createElement('a');
  retweet.href = '#'
  retweet.innerText = 'retweet';

  li.appendChild(tweetUsername);
  li.appendChild(tweetContent);
  li.appendChild(retweet);

  return li;

}

function registerRetweet(item) {
  var link = item;
  link.addEventListener('click',function () {
    var arr = link.parentNode.childNodes;
    tweet(currentUser,'Retweet\n' + '\"' + arr[0].innerText + ': \n' +  arr[1].innerText+ '\"');
    displayTimeline(currentUser);


  });
}

//displays the following of the user
function displayFollowing(user){
  var u1 = followingList;
  if(isValidString(user) && isSignedUp(user)) {
    while (u1.firstChild) {
      u1.removeChild(u1.firstChild);
    }
  }
  var following = users[user].following;
  for (var i = 0; i < following.length; i++){
    var follower = createFollowing(following[i]);
    registerItemEvents(follower);
    u1.appendChild(follower);
  }
}
//creates the actual HTML following element
function createFollowing(user){
  var li = document.createElement('li');
  //li.id = 'a';
  var follower = document.createElement('a');
  follower.href = '#';
  follower.innerText = user;

  li.appendChild(follower);
  //followerInput.value = '';
  return li;
}
//updates the following list and acts when follow button is pressed
function updateFollowing(e){
  if(users[currentUser].following.indexOf(followerInput.value) === -1 && followerInput.value !== currentUser) {
    if(!isSignedUp(followerInput.value)) {
      signup(followerInput.value);
    }
    follow(currentUser, followerInput.value);
    displayFollowing(currentUser);
    followerInput.value = '';
  }
  else {
    alert('Input a valid username to follow');
    followerInput.value = '';
    return false;
  }
}

function registerItemEvents(item) {
  var link = item;
  link.addEventListener('click',function () {
    currentUser = link.innerText;
    currentUserHeader.innerText = currentUser;
    displayTimeline(currentUser);
    displayFollowing(currentUser);
    displayFollowers(currentUser);
  });
}

function displayFollowers(user){
  var u1 = followersList;
  if(isValidString(user) && isSignedUp(user)) {
    while (u1.firstChild) {
      u1.removeChild(u1.firstChild);
    }
  }
  var followers = users[user].followers;
  for (var i = 0; i < followers.length; i++){
    var follower = createFollowers(followers[i]);
    registerItemEvents(follower);
    u1.appendChild(follower);
  }

}

function createFollowers(user) {
  var li = document.createElement('li');
  //li.id = 'followers-list a';
  var following = document.createElement('a');
  following.href = '#';
  following.innerText = user;

  li.appendChild(following);

  return li;
}

function unfollowing(e){
  if(isSignedUp(followerInput.value) && isValidString(followerInput.value) && users[currentUser].following.indexOf(followerInput.value) !== -1){
    unfollow(currentUser, followerInput.value);
    displayFollowing(currentUser);
    displayTimeline(currentUser);
    followerInput.value = '';
  }
  else {
    alert('Enter a valid user to unfollow');
    followerInput.value = '';
    return false;
  }

}

function countCharacters(e){

  count.innerHTML = "Remaining Characters: " + (140 - tweetInput.value.length);
}


window.addEventListener('load', function() {
  currentUserHeader = document.querySelector('#current-user-header');
  switchUserButton = document.querySelector('button#switch-user-button');
  switchUserInput = document.querySelector('input[type=text]#switch-user-input');

  timelineList = document.querySelector('#tweet-list');
  followersList = document.querySelector('#follower-list');
  followingList = document.querySelector('#following-list');
  followerInput = document.querySelector('input[type=text]#follow-input');
  followButton = document. querySelector('button#follow-button');
  unfollowButton = document.querySelector('button#unfollow-button');

  tweetInput = document.querySelector('textarea#tweet-input');
  tweetButton = document.querySelector('button#tweet-button');


  count = document.getElementById('count');

  switchUserButton.addEventListener('click', switchUser);
  followButton.addEventListener('click', updateFollowing);
  tweetButton.addEventListener('click', addTweet);
  unfollowButton.addEventListener('click', unfollowing);
  tweetInput.addEventListener('keyup', countCharacters);

})
