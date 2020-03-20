const config = {
  "APIKey": PropertiesService.getScriptProperties().getProperty("APIKey"),
  "APISecret": PropertiesService.getScriptProperties().getProperty("APISecret"),
  "SlackWebhookURL": PropertiesService.getScriptProperties().getProperty("SlackWebhookURL")
};

var base64Encode = str => {
  const encoded = Utilities.base64EncodeWebSafe(str);
  // Remove padding
  return encoded.replace(/=+$/, "");
};

var encodeJWT = secret => {
  const header = JSON.stringify({
    "typ": "JWT",
    "alg": "HS256"
  });
  const encodedHeader = base64Encode(header);
  const payload = JSON.stringify({
    "iss": config["APIKey"],
    "exp": ((new Date()).getTime() + 5000)
  });
  const encodedPayload = base64Encode(payload);
  const toSign = [encodedHeader, encodedPayload].join(".");
  const signature = Utilities.computeHmacSha256Signature(toSign, secret);
  const encodedSignature = base64Encode(signature);
  return [toSign, encodedSignature].join(".");
};

var getUserId = jwt => {
  const url = "https://api.zoom.us/v2/users";
  const headers = {
    "Authorization": `Bearer ${jwt}`
  };
  const options = {
    "method": "GET",
    "headers": headers
  };
  const response = UrlFetchApp.fetch(url, options);
  const data = JSON.parse(response.getContentText());

  return data["users"][0]["id"];
}

var createMeeting = (topic) => {
  const jwt = encodeJWT(config["APISecret"]);
  const userId = getUserId(jwt);
  const url = `https://api.zoom.us/v2/users/${userId}/meetings`
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${jwt}`
  };
  const payload = JSON.stringify({
    "topic": topic,
    "type": 1
  });
  const options = {
    "method": "POST",
    "payload": payload,
    "headers": headers
  };
  const response = UrlFetchApp.fetch(url, options);
  const data = JSON.parse(response.getContentText());

  return data["join_url"];
}

var sendToSlack = function(text) {
  const url = config["SlackWebhookURL"];
  const payload = JSON.stringify({
    "text": text
  });
  const params = {
    "method" : "post",
    "contentType" : "application/json",
    "payload" : payload
  };
  UrlFetchApp.fetch(url, params);
}

function main() {
  const topic = "Meeting";
  const join_url = createMeeting(topic);
  const text = join_url;

  sendToSlack(text);
}
