class AddCategoryIdToTickets < ActiveRecord::Migration[7.2]
  def change
    add_reference :tickets, :category, null: true, foreign_key: true
  end
end
