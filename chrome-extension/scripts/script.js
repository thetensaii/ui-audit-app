const saveIssue = async (message, screenshotSize, elementRect) => {
  const chromeMessage = {
    type: "capture",
    issue: message,
    screenshotSize,
    elementRect,
  }

  await chrome.runtime.sendMessage(chromeMessage)
}

const getElementRect = (el) => {
  const viewportHeight = window.innerHeight;
  const elementClientRect = el.getBoundingClientRect()

  const elementY = Math.trunc(elementClientRect.y)
  const elementHeight = Math.trunc(elementClientRect.height)

  const computedElementHeight = elementY + elementHeight <= viewportHeight ? elementHeight : viewportHeight - elementY;

  return {
    x: Math.trunc(elementClientRect.x),
    y: elementY,
    width: Math.trunc(elementClientRect.width),
    height: computedElementHeight,
  };
}

const createNewIssueForm = () => {
  const formElement = document.createElement('form')
  formElement.className = "issue-form"

  const inputElement = document.createElement('input')
  inputElement.type = "text"
  inputElement.name = "issue"
  inputElement.className = "issue-form-input"
  inputElement.placeholder = "Issue"
  
  
  const submitButtonElement = document.createElement("button")
  submitButtonElement.type = "submit"
  submitButtonElement.className = "issue-form-btn"
  submitButtonElement.textContent = 'Envoyer';


  formElement.appendChild(inputElement)
  formElement.appendChild(submitButtonElement)
  
  return formElement;
}

const createNewIssueFormWithContainer = () => {
  const divElement = document.createElement('div')
  divElement.className = "issue-form-container"

  const newIssueForm = createNewIssueForm();
  divElement.appendChild(newIssueForm)

  return {
    container: divElement,
    form: newIssueForm,
  }
}


const main = async () => {  
  const allElements = document.querySelectorAll("body *")
  let elementIsSelected = false;

  allElements.forEach((el) => {
    const initialOutilne = el.style.outline;
    const initialBackgroundColor = el.style.backgroundColor;

    el.addEventListener("mouseover", (event) => {
      if(el !== event.target || elementIsSelected) return;
      
      el.style.outline = "2px solid #0000FF";
      el.style.backgroundColor = "rgba(0, 255, 0, 0.2)";
    })
    
    el.addEventListener("mouseout", (event) => {
      if(el !== event.target || elementIsSelected) return;
      
      el.style.outline = initialOutilne;
      el.style.backgroundColor = initialBackgroundColor;
    })

    
    el.addEventListener("click",async (event) => {
      if(el !== event.target || elementIsSelected) return;

      event.preventDefault();
      elementIsSelected = true;

      const { container, form } = createNewIssueFormWithContainer()

      form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(form)
        const issueMessage = formData.get("issue")

        const viewportSize =  {
          width: window.innerWidth,
          height: window.innerHeight,
        }
  
        const elementRect = getElementRect(el)

        container.remove()

        el.style.outline = initialOutilne;
        el.style.backgroundColor = initialBackgroundColor;

        await saveIssue(issueMessage, viewportSize, elementRect);

        elementIsSelected = false;
      })

      document.body.appendChild(container)
    })
  })
}

main()