export class WebAuthnConnect extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
    this._onFormSubmitListener = this._onFormSubmit.bind(this);
    this._onRequestRegisterAddTokenListener = this._onRequestRegisterAddToken.bind(this);
    this.registrationAddTokenUrl = "/api/registration/add";
    this.fetchOptions = {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    };
  }

  static get observedAttributes() {
    return ["label", "input-type", "input-name", "button-text"];
  }

  connectedCallback() {
    this.update();
    this.root.querySelector("form").addEventListener("submit", this._onFormSubmitListener);
    this.addEventListener(
      "connection-request-registration-token",
      this._onRequestRegisterAddTokenListener
    );
  }

  disconnectedCallback() {
    this.root.querySelector("form").removeEventListener("submit", this._onFormSubmitListener);
    this.removeEventListener(
      "connection-request-registration-token",
      this._onRequestRegisterAddTokenListener
    );
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (!this.root.innerHTML) return;
    if (newValue === oldValue) return;

    const label = this.root.querySelector("label");
    const input = this.root.querySelector("input");
    const button = this.root.querySelector("button");

    switch (name) {
      case "no-username":
        this._shouldUseUsername();
        break;
      case "label":
        label.textContent = newValue || this.label;
        break;
      case "button-text":
        button.textContent = newValue || this.buttonText;
        break;
      case "input-type":
        input.type = newValue || this.inputType;
        break;
      case "input-name":
        input.name = newValue || this.inputName;
        break;
    }
  }

  update() {
    if (!this.root.innerHTML) {
      this.root.innerHTML = `
        <form part="form">
          <label part="label" for="peer-code">${this.label}</label>
          <input part="input" id="peer-code" name="${this.inputName}" type="${this.inputType}" required />
          <button part="button" type="submit">${this.buttonText}</button>
        </form>
      `;
    }
  }

  get label() {
    return this.getAttribute("label") || "Username";
  }

  set label(value) {
    this.setAttribute("label", value);
  }

  get buttonText() {
    return this.getAttribute("button-text") || "Login";
  }

  set buttonText(value) {
    this.setAttribute("button-text", value);
  }

  get inputType() {
    return this.getAttribute("input-type") || "text";
  }

  set inputType(value) {
    this.setAttribute("input-type", value);
  }

  get inputName() {
    return this.getAttribute("input-name") || "username";
  }

  set inputName(value) {
    this.setAttribute("input-name", value);
  }

  async _onFormSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const code = formData.get(this.inputName);

    this.dispatchEvent(new CustomEvent("connection-start", { detail: { code } }));
  }

  async _onRequestRegisterAddToken() {
    try {
      const registrationResponse = await fetch(this.registrationAddTokenUrl, this.fetchOptions);

      const jsonRegistrationResponse = await registrationResponse.json();

      if (!registrationResponse.ok) {
        throw new Error("Could not successfuly retrieve registration token");
      }

      this.dispatchEvent(
        new CustomEvent("connection-finished", { detail: jsonRegistrationResponse })
      );
    } catch (error) {
      this.dispatchEvent(
        new CustomEvent("connection-error", { detail: { message: error.message } })
      );
    }

    this.root.querySelector("input").value = "";
  }
}

customElements.define("web-authn-connect", WebAuthnConnect);
