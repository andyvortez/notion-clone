class CreateTickets < ActiveRecord::Migration[7.2]
  has_many: keywords
  def change
    create_table :tickets do |t|
      t.string :ticket_name
      t.text :issue
      t.text :documentation
      t.integer :developer
      t.integer :story_points
      t.boolean :accurate
      t.text :commit

      t.timestamps
    end
  end
end
