class CreateVideos < ActiveRecord::Migration
  def change
    create_table :videos do |t|
      t.string :media_id
      t.references :user, index: true, foreign_key: true
      t.references :issue, index: true, foreign_key: true
      t.timestamps null: false
    end
  end
end
