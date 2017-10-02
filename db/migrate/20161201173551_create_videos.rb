class CreateVideos < ActiveRecord::Migration
  def change
    create_table :videos do |t|
      t.string :url
      t.integer :category_id
      t.integer :user_id
      t.timestamps null: false
    end
  end
end
