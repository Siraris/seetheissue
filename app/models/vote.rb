class Vote < ActiveRecord::Base
  belongs_to :issue
  belongs_to :video
end
