class Video < ActiveRecord::Base
  belongs_to :issue
  belongs_to :user
  has_one :vote
  has_many :statistics
end
