import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["select"]

  connect() {
    this.display = this.element.querySelector(".keywords-display")

    // click display → switch to select
    this.display.addEventListener("click", () => this.showSelect())

    // click away from select → back to display
    this.selectTarget.addEventListener("blur", () => this.hideSelect())
  }

  showSelect() {
    this.display.style.display = "none"
    this.selectTarget.hidden = false
    this.selectTarget.focus()
  }

  hideSelect() {
    this.selectTarget.hidden = true
    this.display.style.display = "block"
  }
}