class AddDescriptionToVideos < ActiveRecord::Migration
  def change
    add_column :videos, :description, :string
    add_column :videos, :title, :string
  end
end
