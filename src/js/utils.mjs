function loadTemplate(path) {
    return async function () {
      const res = await fetch(path);
      if (res.ok) {
        const html = await res.text();
        return html;
      }
    };
  }
  
  async function renderWithTemplate(
    templateFn,
    parentElement,
    data,
    callback,
    position = "afterbegin",
    clear = true
  ) {
    if (clear) {
      parentElement.innerHTML = "";
    }
    const htmlString = await templateFn(data);
    parentElement.insertAdjacentHTML(position, htmlString);
    if (callback) {
      callback(data);
    }
  }
  
  export async function loadPartial(selectedPartial, initFn) {
    const newPage = await loadTemplate(`/partials/${selectedPartial}.html`);
    const element = document.querySelector("main");
    await renderWithTemplate(newPage, element);
    initFn();
  }
  
  export function toggleNav() {
    const updateElement = document.getElementById("menu-icon");
    //toggle adds a class if it's not there or removes it if it is.
    updateElement.classList.toggle("open");
  
    const openMenu = document.getElementById("menu");
    openMenu.classList.toggle("menu-open");
  }
  
  export function setLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }
  
  export function getLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
  }
  
  //still working on this function
  export function checkForm(submitElement, form) {
    document.querySelector(submitElement).addEventListener("click", (e) => {
      e.preventDefault();
      let myForm = document.querySelector(form);
      let chkStatus = myForm.checkValidity();
      myForm.reportValidity();
      if (chkStatus) {
        //doSomething(form);
      }
    });
  }

  export function saveToLocalStorage() {
    
  }