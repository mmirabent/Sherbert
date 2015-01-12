require 'sequel'

DB = Sequel.connect('sqlite://db/titles.db')

class Title < Sequel::Model(:titles)
  plugin :validation_helpers
  def validate
    super
    validates_unique :title
    validates_presence :title, :name
  end
  
  def upvote
    self.votes += 1
    save
  end
end
  