class AddUniqueUserIdIssueIdIndex < ActiveRecord::Migration
  def change
    add_index :videos, ["user_id", "issue_id"], :unique => true
  end
end
