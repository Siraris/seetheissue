class Issue < ActiveRecord::Base
  belongs_to :category
  has_many :votes
end
