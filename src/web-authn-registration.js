const CACHE = {};

export class WebAuthnRegistration extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
    this._onFormSubmitListener = this._onFormSubmit.bind(this);
    this.registrationStartUrl = "/api/registration/start";
    this.registrationFinishUrl = "/api/registration/finish";
    this.fetchOptions = {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    };
  }

  static get observedAttributes() {
    return ["no-username", "label", "input-type", "input-name", "button-text"];
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
          <label part="label" for="authn-username">${this.label}</label>
          <input part="input" id="authn-username" type="${this.inputType}" name="${this.inputName}" />
          <button part="button" type="submit">${this.buttonText}</button>
        </form>
      `;
    }

    this._shouldUseUsername();
  }

  get noUsername() {
    return this.hasAttribute("no-username");
  }

  set noUsername(value) {
    if (!value) {
      this.removeAttribute("no-username");
    } else {
      this.setAttribute("no-username", "");
    }
  }

  get label() {
    return this.getAttribute("label") || "Username";
  }

  set label(value) {
    this.setAttribute("label", value);
  }

  get buttonText() {
    return this.getAttribute("button-text") || "Register";
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

  _shouldUseUsername() {
    const input = this.root.querySelector("input");
    const label = this.root.querySelector("label");

    if (this.noUsername) {
      input.required = false;
      input.hidden = true;
      label.hidden = true;
      input.value = "";
    } else {
      input.required = true;
      input.hidden = false;
      label.hidden = false;
    }
  }

  async _getPublicKeyCredentialCreateOptionsDecoder() {
    if (typeof this.publicKeyCredentialCreateOptionsDecoder === "function") {
      return this.publicKeyCredentialCreateOptionsDecoder;
    }

    if (typeof CACHE.publicKeyCredentialCreateOptionsDecoder === "function") {
      return CACHE.publicKeyCredentialCreateOptionsDecoder;
    }

    const { decodePublicKeyCredentialCreateOptions } = await import("./utils/parse.js");
    CACHE.publicKeyCredentialCreateOptionsDecoder = decodePublicKeyCredentialCreateOptions;

    return CACHE.publicKeyCredentialCreateOptionsDecoder;
  }

  async _getRegisterCredentialEncoder() {
    if (typeof this.registerCredentialEncoder === "function") {
      return this.registerCredentialEncoder;
    }

    if (typeof CACHE.registerCredentialEncoder === "function") {
      return CACHE.registerCredentialEncoder;
    }

    const { encodeRegisterCredential } = await import("./utils/parse.js");
    CACHE.registerCredentialEncoder = encodeRegisterCredential;

    return CACHE.registerCredentialEncoder;
  }

  async _onFormSubmit(event) {
    try {
      event.preventDefault();

      if (!window.PublicKeyCredential) {
        throw new Error("Web Authentication is not supported on this platform");
      }

      this.dispatchEvent(new CustomEvent("registration-started"));

      const formData = new FormData(event.target);
      const username = formData.get(this.inputName);

      const startResponse = await fetch(this.registrationStartUrl, {
        ...this.fetchOptions,
        body: JSON.stringify({ username }),
      });

      const { status, registrationId, publicKeyCredentialCreationOptions } =
        await startResponse.json();

      if (!startResponse.ok) {
        throw new Error(status || "Could not successfuly start registration");
      }

      const decodePublicKeyCredentialCreateOptions =
        await this._getPublicKeyCredentialCreateOptionsDecoder();

      const credential = await navigator.credentials.create({
        publicKey: decodePublicKeyCredentialCreateOptions(publicKeyCredentialCreationOptions),
      });

      this.dispatchEvent(new CustomEvent("registration-created"));

      const encodeRegisterCredential = await this._getRegisterCredentialEncoder();

      const finishResponse = await fetch(this.registrationFinishUrl, {
        ...this.fetchOptions,
        body: JSON.stringify({
          registrationId,
          credential: encodeRegisterCredential(credential),
          userAgent: window.navigator.userAgent,
        }),
      });

      if (!finishResponse.ok) {
        throw new Error("Could not successfuly complete registration");
      }

      const jsonFinishResponse = await finishResponse.json();
      this.dispatchEvent(new CustomEvent("registration-finished", { detail: jsonFinishResponse }));
    } catch (error) {
      this.dispatchEvent(
        new CustomEvent("registration-error", { detail: { message: error.message } })
      );
    }
  }
}

customElements.define("web-authn-registration", WebAuthnRegistration);
