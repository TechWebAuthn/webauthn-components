import { decodePublicKeyCredentialCreateOptions, encodeRegisterCredential } from "./utils/parse.js";

export class WebAuthnEnrollmentRequester extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
    this._onFormSubmitListener = this._onFormSubmit.bind(this);
    this.enrollmentStartUrl = "/api/registration/start";
    this.enrollmentFinishUrl = "/api/registration/finish";
    this.fetchOptions = {
      method: "POST",
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

  attributeChangedCallback(name, oldValue, newValue) {
    if (!this.root.innerHTML) return;
    if (newValue === oldValue) return;

    const label = this.root.querySelector("label");
    const input = this.root.querySelector("input");
    const button = this.root.querySelector("button");

    switch (name) {
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
    if (!this.root.querySelector("form")) {
      const template = new DOMParser()
        .parseFromString(
          `
            <template>
              <form part="form">
                <label part="label" for="webauthn-enrollment-token">${this.label}</label>
                <input part="input" id="webauthn-enrollment-token" type="${this.inputType}" name="${this.inputName}" />
                <button part="button" type="submit">${this.buttonText}</button>
              </form>
            </template>
          `,
          "text/html"
        )
        .querySelector("template");

      this.root.replaceChildren(template.content.cloneNode(true));
    }
  }

  get label() {
    return this.getAttribute("label") || "Enrollment token";
  }

  set label(value) {
    this.setAttribute("label", value);
  }

  get buttonText() {
    return this.getAttribute("button-text") || "Enroll device";
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
    return this.getAttribute("input-name") || "registration-add-token";
  }

  set inputName(value) {
    this.setAttribute("input-name", value);
  }

  async _getPublicKeyCredentialCreateOptionsDecoder() {
    return typeof this.publicKeyCredentialCreateOptionsDecoder === "function"
      ? this.publicKeyCredentialCreateOptionsDecoder
      : decodePublicKeyCredentialCreateOptions;
  }

  async _getRegisterCredentialEncoder() {
    return typeof this.registerCredentialEncoder === "function"
      ? this.registerCredentialEncoder
      : encodeRegisterCredential;
  }

  async _onFormSubmit(event) {
    try {
      event.preventDefault();

      if (!window.PublicKeyCredential) {
        throw new Error("Web Authentication is not supported on this platform");
      }

      this.dispatchEvent(new CustomEvent("enrollment-requested"));

      const formData = new FormData(event.target);
      const registrationAddToken = formData.get(this.inputName);

      const startResponse = await fetch(this.enrollmentStartUrl, {
        ...this.fetchOptions,
        body: JSON.stringify({ registrationAddToken }),
      });

      const { status, registrationId, publicKeyCredentialCreationOptions } = await startResponse.json();

      if (!startResponse.ok) {
        throw new Error(status || "Could not successfuly start enrollment");
      }

      const decoder = await this._getPublicKeyCredentialCreateOptionsDecoder();

      const credential = await navigator.credentials.create({
        publicKey: decoder(publicKeyCredentialCreationOptions),
      });

      this.dispatchEvent(new CustomEvent("enrollment-created"));

      const encoder = await this._getRegisterCredentialEncoder();

      const finishResponse = await fetch(this.enrollmentFinishUrl, {
        ...this.fetchOptions,
        body: JSON.stringify({
          registrationId,
          credential: encoder(credential),
          userAgent: window.navigator.userAgent,
        }),
      });

      if (!finishResponse.ok) {
        throw new Error("Could not successfuly complete enrollment");
      }

      const jsonFinishResponse = await finishResponse.json();
      this.dispatchEvent(new CustomEvent("enrollment-finished", { detail: jsonFinishResponse }));
    } catch (error) {
      this.dispatchEvent(new CustomEvent("enrollment-error", { detail: { message: error.message } }));
    }
  }
}

window.customElements.define("webauthn-enrollment-requester", WebAuthnEnrollmentRequester);
