class Video < ActiveRecord::Base
  belongs_to :issue
  belongs_to :user
  has_one :votes, through: :issue
end
