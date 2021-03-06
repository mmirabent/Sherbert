require "cinch"
require_relative "model"

password = "";

File.open("password.txt","r") do |f|
  password = f.gets
end


# Set up the cinch bot
bot = Cinch::Bot.new do
  configure do |c|
    c.server = "asimov.freenode.net"
    c.port = 6697
    c.channels = ["##percussivemaint"]
    c.nick = "sherbert-bot"
    c.user = "sherbert-bot"
    c.realname = "Sherbert Bot"
    c.ssl.use = true
    c.sasl.username = "sherbert-bot"
    c.sasl.password = password
  end
  
  # When cinch sees the !s flag at the beginning of the message
  on :message, /^!s.*/ do |message|
    title = parse_message(message)
    
    if title.valid?
      title.save
      message.user.send "You suggested \"#{title.title}\" as a show title"
    else
      titles.errors.full_messages.each do |error_message|
        message.user.send error_message
      end
    end
  end
end

def parse_message (message)
  t = Title.new
  t.name = message.user.nick
  t.title = message.message[2..-1].strip
  t.votes = 0
  t
end

@botthread = Thread.new { bot.start }