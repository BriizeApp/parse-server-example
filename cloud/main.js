
  Parse.Cloud.define('hello', function(req, res) {
    res.success('Hi');
  });

  Parse.Cloud.define("requestExpert", async (request) => {
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
    pushQuery.matchesQuery('user', recipientUser); 
    
    const response = await pushQuery.find({ useMasterKey: true });

    // Send push notification to query
    await Parse.Push
      .send({
      where  : pushQuery,
      data   : data
    }, { 
      useMasterKey: true 
    });
    
    return response
  });
