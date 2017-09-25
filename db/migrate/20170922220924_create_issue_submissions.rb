class CreateIssueSubmissions < ActiveRecord::Migration
  def change
    create_table :issue_submissions do |t|
      t.string :issue, :limit=>100
      t.text :details
      t.references :user, index: true, foreign_key: true
      t.timestamps null: false
    end
  end
end
