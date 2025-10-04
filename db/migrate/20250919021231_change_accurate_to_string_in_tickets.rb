class ChangeAccurateToStringInTickets < ActiveRecord::Migration[7.2]
  def change
    change_column :tickets, :accurate, :string
  end
end
