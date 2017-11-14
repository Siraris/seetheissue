class CreateIssues < ActiveRecord::Migration
  def change
    create_table :issues do |t|
      t.string :name
      t.text :description
      t.string :image
      t.references :category, index: true, foreign_key: true
      t.timestamps null: false
    end
  end
end
