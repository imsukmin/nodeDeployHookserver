var http = require('http')
var spawn = require('child_process').spawn
var crypto = require('crypto')
var url = require('url')

var secret = 'nGenius' // secret key of the webhook
var port = 40080 // port

http.createServer(function (req, res) {

  console.log("request received")
  res.writeHead(400, {
    "Content-Type": "application/json"
  })

  var path = url.parse(req.url).pathname

  if ( (path != '/restrictedZoneBotPush' ||  
      path != '/coinoneHelperBotPush') && 
      req.method != 'POST') {
    var data = JSON.stringify({
      "error": "invalid request"
    })
    return res.end(data)
  }

  var jsonString = ''
  req.on('data', function (data) {
    jsonString += data
  })

  req.on('end', function () {
    var hash = "sha1=" + crypto.createHmac('sha1', secret).update(jsonString).digest('hex')
    if (hash != req.headers['x-hub-signature']) {
      console.log('invalid key')
      var data = JSON.stringify({
        "error": "invalid key",
        key: hash
      })
      return res.end(data)
    }
    var runningScriptName = ''
    if (path === '/restrictedZoneBotPush') {
      runningScriptName = 'restrictedZoneTelegramBotHook.sh'
    } else if (path === '/coinoneHelperBotPush') {
      runningScriptName = 'coinoneTelegramBotHook.sh'      
    } else {
      console.log('invalid push path')
      var data = JSON.stringify({
        "error": "invalid push path",
        key: hash
      })
      return res.end(data)
    }
    console.log("running " + runningScriptName)
    var deploySh = spawn('sh', [runningScriptName])
    deploySh.stdout.on('data', function (data) {
      var buff = new Buffer(data)
      console.log(buff.toString('utf-8'))
    })

    res.writeHead(400, {
      "Content-Type": "application/json"
    })

    var data = JSON.stringify({
      "success": true
    })
    return res.end(data)
  })
}).listen(port)

console.log("Server listening at " + port)
