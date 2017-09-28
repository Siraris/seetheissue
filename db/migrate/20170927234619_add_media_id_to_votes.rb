class AddMediaIdToVotes < ActiveRecord::Migration
  def change
     add_reference :votes, :video, index: true
  end
end
