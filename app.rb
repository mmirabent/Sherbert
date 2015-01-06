require 'sinatra'
require 'haml'
require 'json'
require_relative 'bot' # Comment this line to not run the bot
require_relative 'model'

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