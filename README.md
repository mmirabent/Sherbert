# Sherbert

This is a combination IRC bot and ajax enabled web app that allows listeners to suggest and vote on things. The IRC bot listens for !s, and what follows is stored and displayed on the web app for voting. A local session cookie keeps tracks of which items have been voted for and the client-side javascript prevents double-voting. The web app itself is rate limited using Rack::Throttle.

## TODO

* Add web based suggestions
* Make the interface "pretty"

## IRC Password

The password for the SASL auth should be in a file named password.txt. This
file is read when the bot starts and is ommitted from this repository for
security reasons
