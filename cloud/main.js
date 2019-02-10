
  Parse.Cloud.define('hello', function(req, res) {
    res.success('Hi');
  });

  Parse.Cloud.define("requestExpert", function(request, response) {
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
    var pushQuery = new Parse.Query(Parse.Installation);
    pushQuery.equalTo('deviceType', 'ios');
    pushQuery.matchesQuery ('_User', recipientUser); 
    
    // Safety Check
    pushQuery.find({useMasterKey: true })
      .then(function(results) {
      console.log("pushQuery got " + results.length);
    }, function(error) {
      throw error.message
    });

    // Send push notification to query
    Parse.Push.send ({
      where: pushQuery,
      data : data
    }, { success: function() {
        console.log("#### PUSH OK");
      }, error. : function(error) {
        console.log("#### PUSH ERROR" + error.message);
      }, useMasterKey: true});
    
    response.success('success');
  });
