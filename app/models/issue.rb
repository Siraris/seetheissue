class Issue < ActiveRecord::Base
  extend FriendlyId
  friendly_id :name, use: [:slugged, :history,:finders]

  belongs_to :category
  has_many :votes
end
