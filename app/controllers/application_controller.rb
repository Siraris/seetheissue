class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  before_action :set_facebook_metadata

  def ssl_configured?
    !Rails.env.development? && !Rails.env.test?
  end

  def set_facebook_metadata
    @facebook_metadata = {
      'og:url' => request.original_url,
      'og:locale' => 'en_US',
      'og:type' => 'website',
      'og:title' => "Where the worlds issues come to life",
      'og:description' => 'Share your opinion, see what others have to say, bring issues to life',
    }

    @facebook_metadata
  end
end
