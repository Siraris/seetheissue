class AddZipCodeToUsers < ActiveRecord::Migration
  def change
    add_column :users, :zipcode, :string, :limit => 10
  end
end
