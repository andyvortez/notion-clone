# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.2].define(version: 2025_07_16_191754) do
  create_table "categories", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "keywords", force: :cascade do |t|
    t.string "keyword"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "keywords_tickets", id: false, force: :cascade do |t|
    t.integer "ticket_id", null: false
    t.integer "keyword_id", null: false
    t.index ["keyword_id"], name: "index_keywords_tickets_on_keyword_id"
    t.index ["ticket_id"], name: "index_keywords_tickets_on_ticket_id"
  end

  create_table "tickets", force: :cascade do |t|
    t.string "ticket_name"
    t.text "issue"
    t.text "documentation"
    t.integer "developer"
    t.integer "story_points"
    t.boolean "accurate"
    t.text "commit"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "category_id"
    t.index ["category_id"], name: "index_tickets_on_category_id"
  end

  add_foreign_key "tickets", "categories"
end
