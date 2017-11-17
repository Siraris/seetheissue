class AddLocationDataToUser < ActiveRecord::Migration
  def change
    add_column :users, :region, :string
    add_column :users, :county, :string
    add_column :users, :locality, :string
    add_column :users, :postal_gid, :string
  end
end
