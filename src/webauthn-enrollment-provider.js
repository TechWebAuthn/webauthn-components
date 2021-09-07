export class WebAuthnEnrollmentProvider extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
    this._onFormSubmitListener = this._onFormSubmit.bind(this);
    this.enrollmentTokenUrl = "/api/registration/add";
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
  }

  disconnectedCallback() {
    this.root.querySelector("form").removeEventListener("submit", this._onFormSubmitListener);
  }

  attributeChangedCallback(_name, oldValue, newValue) {
    if (!this.root.innerHTML) return;
    if (newValue === oldValue) return;

    const button = this.root.querySelector("button");
    button.textContent = newValue || this.buttonText;
  }

  update() {
    if (!this.root.innerHTML) {
      this.root.innerHTML = `
        <form part="form">
          <button part="button" type="submit">${this.buttonText}</button>
        </form>
      `;
    }
  }

  get buttonText() {
    return this.getAttribute("button-text") || "Connect";
  }

  set buttonText(value) {
    this.setAttribute("button-text", value);
  }

  async _onFormSubmit(event) {
    try {
      event.preventDefault();

      this.dispatchEvent(new CustomEvent("enrollment-requested"));

      const response = await fetch(this.enrollmentTokenUrl, this.fetchOptions);

      const jsonResponse = await response.json();

      if (!response.ok) {
        throw new Error("Could not successfuly retrieve enrollment token");
      }

      this.dispatchEvent(new CustomEvent("enrollment-provided", { detail: jsonResponse }));
    } catch (error) {
      this.dispatchEvent(
        new CustomEvent("enrollment-error", { detail: { message: error.message } })
      );
    }
  }
}

window.customElements.define("webauthn-enrollment-provider", WebAuthnEnrollmentProvider);
