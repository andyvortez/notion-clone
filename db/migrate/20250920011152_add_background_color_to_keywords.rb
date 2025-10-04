class AddBackgroundColorToKeywords < ActiveRecord::Migration[7.2]
  def change
    add_column :keywords, :background_color, :string
  end
end
