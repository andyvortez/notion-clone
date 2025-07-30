import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    console.log("Editable cell controller connected")
    
    // Store the turbo frame reference when controller connects
    this.turboFrame = this.element.closest('turbo-frame')
    console.log("Stored turbo frame:", this.turboFrame?.id)
    
    // Listen for when this turbo frame loads new content
    if (this.turboFrame) {
      this.turboFrame.addEventListener('turbo:frame-load', this.handleFrameLoad.bind(this))
    }
  }

  disconnect() {
    console.log("Issue cell controller disconnected")
    this.removeClickListener()
  }

  edit() {
    console.log("Edit method called for frame:", this.turboFrame?.id)
    
    if (!this.turboFrame) {
      console.log("No turbo frame available")
      return
    }
    
    const frameId = this.turboFrame.id
    
    // Build the URL to request the edit form
    let editUrl
    if (frameId.includes('new_ticket')) {
        const categoryId = frameId.split('_').pop()
        editUrl = `/tickets/new_field?field=issue&frame_id=${frameId}&category_id=${categoryId}`
    } else {
        
        const ticketId = frameId.split('_')[1]
        editUrl = `/tickets/${ticketId}/edit_field?field=${fieldName}&frame_id=${frameId}`
    }
    
    console.log("Loading edit URL:", editUrl)
    // Tell the turbo frame to load the edit form
    this.turboFrame.src = editUrl
  }

  handleFrameLoad(event) {
    console.log("Frame loaded, checking for form...")
    const form = event.target.querySelector('form')
    if (form) {
      console.log("Form found, adding click listener")
      this.addClickListener()
    } else {
      console.log("No form found, removing click listener")
      this.removeClickListener()
    }
  }

  addClickListener() {
    console.log("Adding click listener for frame:", this.turboFrame?.id)
    this.removeClickListener() // Remove any existing listener first
    this.boundSubmitOnOutsideClick = this.submitOnOutsideClick.bind(this)
    document.addEventListener('click', this.boundSubmitOnOutsideClick)
  }

  removeClickListener() {
    if (this.boundSubmitOnOutsideClick) {
      console.log("Removing click listener for frame:", this.turboFrame?.id)
      document.removeEventListener('click', this.boundSubmitOnOutsideClick)
      this.boundSubmitOnOutsideClick = null
    }
  }

  submitOnOutsideClick(event) {
    console.log("Click detected on frame:", this.turboFrame?.id, "target:", event.target)
    
    if (!this.turboFrame) {
      console.log("No turbo frame reference")
      return
    }
    
    // Check if there's currently a form in this turbo-frame
    const form = this.turboFrame.querySelector('form')
    if (!form) {
      console.log("No form found in turbo-frame, removing listener")
      this.removeClickListener() // Clean up since form is gone
      return
    }
    
    // Check if click is outside this turbo-frame
    if (!this.turboFrame.contains(event.target)) {
      console.log("Click outside turbo-frame, submitting form...")
      this.submitForm(form)
      this.removeClickListener() // Remove listener after submitting
    } else {
      console.log("Click inside turbo-frame, not submitting")
    }
  }

  submitForm(form) {
    console.log("Submitting form in frame:", this.turboFrame?.id)
    const submitButton = form.querySelector('#auto-submit')
    if (submitButton) {
      console.log("Clicking submit button")
      submitButton.click()
    } else {
      console.log("No submit button found!")
    }
  }

  submitOnEnter(event) {
    if (event.key === "Enter") {
      event.preventDefault()
      this.submitForm(event.target.form)
      this.removeClickListener()
    }
  }

  submit(event) {
    this.submitForm(event.target.form)
    this.removeClickListener()
  }
}