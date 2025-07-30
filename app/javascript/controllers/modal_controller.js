import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="modal"
export default class extends Controller {
  static targets = ["content"]
  
  connect() {
    this.boundCloseOnOutsideClick = this.closeOnOutsideClick.bind(this)
    document.addEventListener('click', this.boundCloseOnOutsideClick)
  }
  
  disconnect() {
    document.removeEventListener('click', this.boundCloseOnOutsideClick)
  }
  
  open() {
    this.contentTarget.style.display = "block"
    console.log("Modal opened")
  }
  
  close() {
    console.log("Modal closing")
    this.contentTarget.style.display = "none"
  }
  
  closeOnOutsideClick(event) {
    if (this.contentTarget.style.display !== "none") {
      if (!this.contentTarget.contains(event.target) &&
          !this.element.querySelector('.account-modal').contains(event.target)) {
        this.close()
      }
    }
  }
}