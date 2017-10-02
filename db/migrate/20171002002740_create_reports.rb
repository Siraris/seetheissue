class CreateReports < ActiveRecord::Migration
  def change
    create_table :reports do |t|
      t.references :user, index: true, foreign_key: true
      t.references :video, index: true, foreign_key: true
      t.string     :comment
      t.string     :category
      t.timestamps null: false
    end
  end
end
