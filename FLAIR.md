# FLAIR

- Enter first piece of flair here
I added an unfollow button in the html document and then made an unfollowing function

<button id ="unfollow-button" class="btn btn-default">Unfollow</button>
function unfollowing(e){
  if(isSignedUp(followerInput.value) && isValidString(followerInput.value) && users[currentUser].following.indexOf(followerInput.value) !== -1){
    unfollow(currentUser, followerInput.value);
    displayFollowing(currentUser);
    displayTimeline(currentUser);
    followerInput.value = '';
  }
  else {
    alert('Enter a valid user to unfollow');
  }
}

- Second piece
  I added input validation to every input and created alerts when the input wasn't correct
  function updateFollowing(e){

    if(isSignedUp(followerInput.value) && isValidString(followerInput.value)){
      follow(currentUser, followerInput.value);
      displayFollowing(currentUser);
      followerInput.value = '';
    }
    else {
      alert('input a valid username to follow');
    }
  }

  function addTweet(e){
    if(tweetInput.value && tweetInput.value.length <= 140 && isSignedUp(currentUser)){
      tweet(currentUser, tweetInput.value);
      displayTimeline(currentUser);
      tweetInput.value = '';
    }
    else{
      alert('Please enter a valid username or tweet');
    }
  }

  function switchUser(e){
    if(isValidString(switchUserInput.value)){
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
    }
  }



- Third piece
 implemented a retweet function as a link at the bottom of a tweet

 I first created the actual HTML element in the window with these lines of code in my
 createTweet function
 var retweet = document.createElement('a');
 retweet.href = '#'
 retweet.innerText = 'retweet';

 this is how I call the function in the displayTimeline function
 registerRetweet(tweet.childNodes[2]);

 function registerRetweet(item) {
   var link = item;
   link.addEventListener('click',function () {
     var arr = link.parentNode.childNodes;
     tweet(currentUser,'Retweet\n' + '\"' + arr[0].innerText + ': \n' + arr[1].innerText+ '\"');
     displayTimeline(currentUser);
   });
 }


- Fourth piece
  CSS additions, I styled the page to make it look a bit better added button colors and iconglyphs on the buttons within the html file
  I also added a unfollow button
  I also changed the background color to a light grey
  I added animations on some of the elements using the animate.css css stylesheet

  This is how I added in the icons to the buttons and changed their colors
  <span class="glyphicon glyphicon-user" aria-hidden="true"></span>
  <button id="follow-button" class="btn btn-success"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span> Follow</button>
  <button id ="unfollow-button" class="btn btn-warning"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span> Unfollow</button>

  This is how I changed the background color
  body {
    background-color: #eee;
  }

  animating css elements

  <h1 class="animated bounce">Twitter</h1>
  li.className = 'list-group-item tweet animated slideInDown';
