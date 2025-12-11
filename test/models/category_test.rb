require "test_helper"

class CategoryTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end

  def setup
    @category = Category.new(name: "Marketing", id: 99)
    @ticket = Ticket.new(ticket_name: "TicketTest")
  end

  test "category should be valid" do
    assert @category.valid?
  end

  test "category name should be present" do
    @category.name = " "
    assert_not @category.valid?
  end

  # needs to save to compare
  test "category name should be unique" do
    @category.save!
    @category2 = Category.new(name: "Marketing")
    assert_not @category2.valid?
  end

  test "category should accept tickets" do
    @category.save!
    @ticket.category_id = @category.id
    @ticket.save!
    assert_equal 1, @category.tickets.count
  end
end
