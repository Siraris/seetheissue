class AddApprovedFlagToVideos < ActiveRecord::Migration
  def change
    add_column :videos, :approved, :integer, :limit => 2, :default => false
  end
end
