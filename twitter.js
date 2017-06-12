/*
* @module Twitter
* This module contains 6 functions which need to be implemented. Each function
* has comments defining the inputs and outputs of each function. Modify this
* file as needed to complete the assignemtn howver DO NOT modify the function
* signatures or the module.exports at the bottom of the file.
*/
var users = [];

var usernames = [];





/*
* @function
* @name signup
* The signup function adds a new user to twitter. Users must be signed up
* before being used in any of the other functions.
*
* @param   {string} user   The user to signup.
*/
function signup(user) {

  if(user === '' || usernames.indexOf(user) !== -1 || typeof user !== 'string') {
    return false
  }
  var User = {
    username: user,
    timeline: [],
    followers: [],
    following: []
  }

  users.push(User);
  usernames =  users.map(function(User) {
    return User.username;
  });
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
  if(usernames.indexOf(user) !== -1 && user) {
    return users[usernames.indexOf(user)].timeline;
  }
  return false;
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
  if(usernames.indexOf(follower) !== -1 && usernames.indexOf(user) !== -1 && user !== follower) {
    var userObj = users[usernames.indexOf(user)];
    var followerObj = users[usernames.indexOf(follower)];
    if(userObj.followers.indexOf(followerObj) === -1  ) {
      userObj.followers.push(followerObj);
      followerObj.following.push(userObj);
      return true;
    }
  }
  return false;
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

  if(usernames.indexOf(follower) !== -1 && usernames.indexOf(user) !== -1 && user !== follower) {
    var userObj = users[usernames.indexOf(user)];
    var followerObj = users[usernames.indexOf(follower)];
    var index = userObj.followers.indexOf(followerObj);
    if(index > -1) {
      followerObj.following.splice(followerObj.following.indexOf(userObj), 1);
      userObj.followers.splice(index,1);
      return true;
    }

  }
  return false;
}
/*function displayID() {
  console.log(this.id);
}*/

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

  if(user && content &&  content.length <= 140 && usernames.indexOf(user) !== -1 && typeof content === 'string') {
    this.content = content;
    this.user = user;
    var d = new Date();

    var tweetObj =  {
      id : Math.round(Math.random() * (999999999 - 100000) + 100000),
      content: content,
      username: user,
      date : d.toISOString(),
      retweet : false,
      favorites : 0,
    }


    users[usernames.indexOf(user)].timeline.unshift(tweetObj);
    var listOfFollowers = users[usernames.indexOf(user)].followers;
    if(listOfFollowers) {
      listOfFollowers.forEach(function(User) {
        User.timeline.unshift(tweetObj);
      });
    }
    //displayID.apply(tweetObj);
    return tweetObj;
  }
  return false;

}
