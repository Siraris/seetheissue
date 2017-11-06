class CreateVideos < ActiveRecord::Migration
  def change
    create_table :videos do |t|
      t.string :media_id
      t.integer :user_id
      t.integer :issue_id
      t.timestamps null: false
    end
  end
end
