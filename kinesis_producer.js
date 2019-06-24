exports.handler = (event, context, callback) => {
     var bodyData = new Buffer(event.Records[0].cf.request.body.data, 'base64').toString("utf-8");
     var AWS = require('aws-sdk');
     var kinesisfh = new AWS.Firehose({region: 'us-east-1'});  //uncomment if you want a specific-region of Firehose
     var kinesisfh = new AWS.Firehose();  //or provision a firehose in every region where Lambda may run
     var params = {
        DeliveryStreamName: 'rgedgetest', /* required */
        Record: { /* required */
         Data: JSON.stringify({bodyData})
       }
      };
      var responseBody = "Successfully Submitted Record";
        responseBody +=  bodyData;
        responseBody += context.invokedFunctionArn;
        responseBody += "Invoke Id: ";
        responseBody += context.invokeid;
      kinesisfh.putRecord(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else console.log(responseBody); // successful response
      });
      var headers = [];
      headers['strict-transport-security'] = [{
        key: 'Strict-Transport-Security',
       value: "max-age=31536000; includeSubdomains; preload"
      }];
      headers['content-security-policy'] = [{
        key: 'Content-Security-Policy',
        value: "default-src 'none'; img-src 'self'; script-src 'self';  style-src 'self'; object-src 'none'"
      }];
      headers['x-content-type-options'] = [{
        key: 'X-Content-Type-Options',
        value: "nosniff"
      }];
      const response = {
        body: responseBody,
        bodyEncoding: 'text',
        headers,
        status: '200',
        statusDescription: 'OK'
      };
      callback(null, response);
      return response;
    };