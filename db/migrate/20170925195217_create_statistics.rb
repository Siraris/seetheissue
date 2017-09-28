class CreateStatistics < ActiveRecord::Migration
  def change
    create_table :statistics do |t|
      t.references :video, index: true, foreign_key: true
      t.references :user, index: true, foreign_key: true
      t.integer :watched
      t.integer :completed
      t.integer :shared
      t.timestamps null: false
    end
  end
end
