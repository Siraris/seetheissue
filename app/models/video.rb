class Video < ActiveRecord::Base
  belongs_to :issue
  belongs_to :user
  has_one :vote
  has_many :statistics
  has_many :reports

  before_destroy :destroy_from_cloud

  scope :with_issue, -> {
    includes(:issue)
  }

  default_scope {where("approved = true")}

  def destroy_from_cloud
    jwService = JWService.new
    result = jwService.destroy(self.media_id)
    return false unless (result)
  end
end
