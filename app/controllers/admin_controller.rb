class AdminController < ApplicationController
  force_ssl if: :ssl_configured?

  layout 'admin'

  before_action :authenticate_user!
end
