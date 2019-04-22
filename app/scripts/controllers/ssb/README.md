# SSB Controller



## Expectations
The ssb controller will manage a custom sbot instance
exposing the methods

all methods return a promise unless given an optional callback

### publish (content={type:'post'/*default type*/, private:true}, cb=()=>{})
  howerver private is on the content body it will be removed before publish
  all other keys in the content body will be published in the message
  optional call back if no call back return a promise

### getFeed (feedId)
returns an array of all known messages for any given feed

### subscribe (feedId, handler)
the handler is called anytime a new message is received for a given feed
if feedId is `'*'` all log messages will trigger the handler

### getUserIds (index=1, cb)
returns an array of users public address

### createNewIdentity (cb)
returns the users public address and index=1