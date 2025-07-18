class CreateJoinTableTicketsKeywords < ActiveRecord::Migration[7.2]
  def change
    create_join_table :tickets, :keywords do |t|
      t.index :ticket_id
      t.index :keyword_id
    end
  end
end
