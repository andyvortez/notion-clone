import { Controller } from "@hotwired/stimulus"


export default class extends Controller {
  connect() {
    if (!window.currentTicketMappings) {
      window.currentTicketMappings = {}
    }
    // Store the turbo frame reference when controller connects
    this.turboFrame = this.element.closest('turbo-frame')
    
    // Listen for when this turbo frame loads new content
    if (this.turboFrame) {
      this.turboFrame.addEventListener('turbo:frame-load', this.handleFrameLoad.bind(this))
    }
  }

  disconnect() {
    this.removeClickListener()
  }

  edit() {
    if (!this.turboFrame) {
      return
    }
    
    const frameId = this.turboFrame.id;
    let editUrl;
    let fieldName;  // Use fieldName instead of columnId for clarity
  
    if (frameId.includes('new_ticket')) {
      
      // Extract field name and category ID first
      let withoutPrefix = frameId.replace('new_ticket_', '');
      let lastUnderscore = withoutPrefix.lastIndexOf('_');
      fieldName = withoutPrefix.substring(0, lastUnderscore);
      const categoryId = withoutPrefix.substring(lastUnderscore + 1);
      
      // Now create the row key
      const rowKey = `new_ticket_${categoryId}`;
      if (window.currentTicketMappings[rowKey]) {  // ← Fixed: add window.
        const ticketId = window.currentTicketMappings[rowKey];
        editUrl = `/tickets/${ticketId}/edit_field?field=${fieldName}&frame_id=${frameId}`;
      } else {
        editUrl = `/tickets/new_field?field=${fieldName}&frame_id=${frameId}&category_id=${categoryId}`;
      }
    }  else {
      // Existing ticket logic  
      const firstUnderscore = frameId.indexOf('_');
      const secondUnderscore = frameId.indexOf('_', firstUnderscore + 1);
      fieldName = frameId.substring(secondUnderscore + 1);
      
      const ticketId = frameId.substring(firstUnderscore + 1, secondUnderscore);
      editUrl = `/tickets/${ticketId}/edit_field?field=${fieldName}&frame_id=${frameId}`;
    }
    const allTurboFrames = document.querySelectorAll('turbo-frame form')
    if (allTurboFrames.length > 0) {
      return
    } else {
      this.turboFrame.src = editUrl
    }
  }

  handleFrameLoad(event) {
    const form = event.target.querySelector('form')
    if (form) {
      this.addClickListener()
      const textField = form.querySelector('textarea, input[type="text"]')
      if (textField && textField.value) {
        textField.focus()
        textField.setSelectionRange(textField.value.length, textField.value.length)
      }
    } else {
      console.log("there is not a form")
      this.removeClickListener()
      this.checkForNewTicketCreation(event.target)
    }
  }

  checkForNewTicketCreation(turboFrame) {
    const frameId = turboFrame.id

    if (!frameId.includes('new_ticket')) {
      return
    }
    const cellContent = turboFrame.textContent.trim()

    if (cellContent && cellContent !== '\u00a0' && !cellContent.includes('Click to add')) {
      const categoryId = frameId.split('_').pop()
      const rowKey = `new_ticket_${categoryId}`
      this.extractAndStoreTicketId(rowKey, turboFrame)
    }
  }

  extractAndStoreTicketId(rowKey, turboFrame) {
    // Look for ticket ID on child elements instead of turbo-frame
    const cellDiv = turboFrame.querySelector('.cell-display')
    const ticketId = cellDiv?.dataset.ticketId
    
    if (ticketId) {
      // Try this assignment instead
      Object.assign(window.currentTicketMappings, { [rowKey]: parseInt(ticketId) })
    }
  }

  addClickListener() {
    this.removeClickListener() // Remove any existing listener first
    this.boundSubmitOnOutsideClick = this.submitOnOutsideClick.bind(this)
    document.addEventListener('click', this.boundSubmitOnOutsideClick)
  }

  removeClickListener() {
    if (this.boundSubmitOnOutsideClick) {
      document.removeEventListener('click', this.boundSubmitOnOutsideClick)
      this.boundSubmitOnOutsideClick = null
    }
  }

  submitOnOutsideClick(event) {
    if (!this.turboFrame) {
      return
    }
    
    // Check if there's currently a form in this turbo-frame
    const form = this.turboFrame.querySelector('form')
    if (!form) {
      this.removeClickListener() // Clean up since form is gone
      return
    }
    
    // Check if click is outside this turbo-frame
    if (!this.turboFrame.contains(event.target)) {
      const textField = form.querySelector('textarea, input[type="text"]')
      if (textField && textField.value.trim() !== '') {
        this.submitForm(form)
      } else {
        this.closeForm()
      }
      this.removeClickListener() // Remove listener after submitting
    }
  }

  closeForm() {
    // Reload the original display content
    this.turboFrame.innerHTML = this.originalContent || ''
  }

  submitForm(form) {
    const submitButton = form.querySelector('#auto-submit')
    if (submitButton) {
      submitButton.click()
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
