class HealthController < ApplicationController

  def show
    render text: Video.first.try(:id)
  end
end
