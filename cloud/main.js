
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

   let results;
    try {
        results = await pushQuery.find();
        console.log("pushQuery got " + results.length);
       }
    } catch(error){
        throw error.message;
    }
  
  // Send push notification to query
  Parse.Push.send({
    where: query,
    data: {
        alert: 'One more test 1',
        badge: 1,
        sound: 'default',
        objectId: someKey,
        'content-available': 1
    }
}, { useMasterKey: true });
  
});

