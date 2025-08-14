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
    console.log("Issue cell controller disconnected")
    this.removeClickListener()
  }

  edit() {
    console.log("Edit method called for frame:", this.turboFrame?.id)
    
    if (!this.turboFrame) {
      console.log("No turbo frame available")
      return
    }
    
    const frameId = this.turboFrame.id;
    console.log("Frame ID:", frameId); 
    let editUrl;
    let fieldName;  // Use fieldName instead of columnId for clarity
  
    if (frameId.includes('new_ticket')) {
      console.log("Taking new ticket path");
      
      // Extract field name and category ID first
      let withoutPrefix = frameId.replace('new_ticket_', '');
      let lastUnderscore = withoutPrefix.lastIndexOf('_');
      fieldName = withoutPrefix.substring(0, lastUnderscore);
      const categoryId = withoutPrefix.substring(lastUnderscore + 1);
      
      // Now create the row key
      const rowKey = `new_ticket_${categoryId}`;
      console.log("THIS IS THE ROW KEY:", rowKey)
      console.log("Current ticket mappings:", JSON.stringify(window.currentTicketMappings))
      console.log("Checking if rowKey exists:", window.currentTicketMappings[rowKey])
      console.log("All keys in mappings:", Object.keys(window.currentTicketMappings))  
      if (window.currentTicketMappings[rowKey]) {  // ← Fixed: add window.
        console.log("Found existing ticket:", window.currentTicketMappings[rowKey]);
        const ticketId = window.currentTicketMappings[rowKey];
        editUrl = `/tickets/${ticketId}/edit_field?field=${fieldName}&frame_id=${frameId}`;
      } else {
        console.log("Creating new ticket");
        editUrl = `/tickets/new_field?field=${fieldName}&frame_id=${frameId}&category_id=${categoryId}`;
      }
    }  else {
      console.log("Taking existing ticket path");
      // Existing ticket logic  
      const firstUnderscore = frameId.indexOf('_');
      const secondUnderscore = frameId.indexOf('_', firstUnderscore + 1);
      fieldName = frameId.substring(secondUnderscore + 1);
      
      const ticketId = frameId.substring(firstUnderscore + 1, secondUnderscore);
      editUrl = `/tickets/${ticketId}/edit_field?field=${fieldName}&frame_id=${frameId}`;
    }
    console.log("Field name extracted:", fieldName);
    console.log("Loading edit URL:", editUrl)
    const allTurboFrames = document.querySelectorAll('turbo-frame form')
    if (allTurboFrames.length > 0) {
      console.log('NOT ACTIVATING BECAUSE THERE IS ANOTHER FRAME OPEN-------------------')
      return
    } else {
      this.turboFrame.src = editUrl
    }
  }

  handleFrameLoad(event) {
    console.log("Frame loaded, checking for form...")
    const form = event.target.querySelector('form')
    if (form) {
      console.log("Form found, adding click listener")
      this.addClickListener()
      const textField = form.querySelector('textarea, input[type="text"]')
      if (textField && textField.value) {
        textField.focus()
        textField.setSelectionRange(textField.value.length, textField.value.length)
      }
    } else {
      console.log("No form found, removing click listener")
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
      console.log("Detected successful ticket creation in frame:", frameId)
      const categoryId = frameId.split('_').pop()
      const rowKey = `new_ticket_${categoryId}`
      this.extractAndStoreTicketId(rowKey, turboFrame)
    }
  }

  extractAndStoreTicketId(rowKey, turboFrame) {
    console.log("=== EXTRACT AND STORE DEBUG ===")
    
    // Look for ticket ID on child elements instead of turbo-frame
    const cellDiv = turboFrame.querySelector('.cell-display')
    const ticketId = cellDiv?.dataset.ticketId
    
    console.log("Found cell div:", cellDiv)
    console.log("Cell div dataset:", cellDiv?.dataset)
    console.log("Ticket ID from cell:", ticketId)
    
    if (ticketId) {
      console.log(`SUCCESS: Found ticket ID: ${ticketId}`)
      // Try this assignment instead
      Object.assign(window.currentTicketMappings, { [rowKey]: parseInt(ticketId) })
      console.log("Updated mappings:", JSON.stringify(window.currentTicketMappings))
    } else {
      console.log("FAILED: No ticket ID found on child element")
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
      const textField = form.querySelector('textarea, input[type="text"]')
      if (textField && textField.value.trim() !== '') {
        console.log("Click outside turbo-frame, submitting form...")
        this.submitForm(form)
      } else {
        console.log("NOTSAVING")
        this.closeForm()
      }
      this.removeClickListener() // Remove listener after submitting
    } else {
      console.log("Click inside turbo-frame, not submitting")
    }
  }

  closeForm() {
    console.log("Closing form without saving")
    // Reload the original display content
    this.turboFrame.innerHTML = this.originalContent || ''
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
