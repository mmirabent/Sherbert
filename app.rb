require 'sinatra'
require 'haml'
require 'json'
require 'sinatra/json'
require 'rack/throttle'
# require_relative 'bot' # Comment this line to not run the bot for development
require_relative 'model'

# Had to disable throttling for now, because javascript and css pages are being
# served from the app itself (because webbrick). In production these files will
# be served from the web server itself (probably nginx) and never seen by 
# sinatra

# use Rack::Throttle::Interval, :min => 1.0

get '/' do
  @titles = Title.order_by(:votes).reverse
  haml :titles
end

post '/vote/:id' do
  title = Title[params[:id]]
  title.upvote
  title.save
  json({:id => params[:id], :votes => title.votes})
end

post '/vote' do
  request.body.rewind
  request_payload = JSON.parse(request.body.read)
  title = Title.new
  title.name = request_payload["name"]
  title.title = request_payload["title"]
  if title.valid?
    title.save
    json({:id => title.id, :name => title.name, :title => title.title})
  else
    halt 400, json({:errors => title.errors.full_messages})
  end
end