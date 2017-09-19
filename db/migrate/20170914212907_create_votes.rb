class CreateVotes < ActiveRecord::Migration
  def change
    create_table :votes do |t|
      t.references :issue, index: true, foreign_key: true
      t.references :user, index: true, foreign_key: true
      t.integer :vote, :limit => 2
      t.timestamps null: false
    end
  end
end
