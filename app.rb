require 'sinatra'
require 'haml'
require 'json'
require 'rack/throttle'
require_relative 'bot' # Comment this line to not run the bot
require_relative 'model'

use Rack::Throttle::Interval, :min => 1.0

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