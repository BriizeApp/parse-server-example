
Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
});

Parse.Cloud.define("requestExpert", async request=> {
  console.log("Inside requestExpert");
  var params = request.params;
  var user = request.user;
  var sessionToken = user.getSessionToken();
  var someKey = request.someKey;
  var data = params.data;

 // Set our query to target specific user 
  var recipientUser = new Parse.Query(Parse.User);
  recipientUser.equalTo("objectId", request.params.someKey);

// Set our installation query
   const pushQuery = new Parse.Query(Parse.Installation);
   pushQuery.equalTo('deviceType', 'ios');
   pushQuery.matchesQuery('user', recipientUser); 
  
  pushQuery.find({ useMasterKey: true })
    .then(function(object) {
        console.log("pushQuery got " + object.length);
        }, function(error) {
            console.error("pushQuery find failed. error = " + error.message);
    });

  // Send push notification to query
  Parse.Push.send({
    where: pushQuery,
    data: data  
  }, { useMasterKey: true })
    .then(function() {
      // Push sent!
      console.log("#### push sent!");
    }, function(error) {
      // There was a problem :(
      console.error("#### push error" + error.message);
    });
});

