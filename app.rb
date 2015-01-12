require 'sinatra'
require 'haml'
require 'json'
require 'rack/throttle'
require_relative 'bot' # Comment this line to not run the bot
require_relative 'model'

use Rack::Throttle::Interval, :min => 1.0

before do
  request.body.rewind
  @request_payload = JSON.parse(request.body.read)
end

get '/' do
  @titles = Title.order_by(:votes).reverse
  haml :titles
end

post '/vote/:id' do
  title = Title[params[:id]]
  title.upvote
  title.save
  {:id => params[:id], :votes => title.votes}.to_json
end

post '/vote' do
  title = Title.new
  title.name = @request_payload["name"]
  title.title = @request_payload["title"]
  if title.valid?
    title.save
    {:id => title.id, :name => title.name, :title => title.title}.to_json
  else
    {:errors => title.errors.full_messages}.to_json
  end
end