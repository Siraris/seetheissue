class AddTopIssueToIssues < ActiveRecord::Migration
  def change
    add_column :issues, :top_issue, :boolean, default: false
  end
end
