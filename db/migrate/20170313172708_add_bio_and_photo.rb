class AddBioAndPhoto < ActiveRecord::Migration
  def change
     change_table :users do |t|
      t.string :bio,              null: false, default: ""
      t.string :photo,            null: true, default: nil
    end
  end
end
