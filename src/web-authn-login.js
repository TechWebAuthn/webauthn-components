const CACHE = {};

export class WebAuthnLogin extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
    this._onFormSubmitListener = this._onFormSubmit.bind(this);
    this.assertionStartUrl = "/api/assertion/start";
    this.assertionFinishUrl = "/api/assertion/finish";
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

  async _getPublicKeyCredentialRequestOptionsDecoder() {
    if (typeof this.publicKeyCredentialRequestOptionsDecoder === "function") {
      return this.publicKeyCredentialRequestOptionsDecoder;
    }

    if (typeof CACHE.publicKeyCredentialRequestOptionsDecoder === "function") {
      return CACHE.publicKeyCredentialRequestOptionsDecoder;
    }

    const { decodePublicKeyCredentialRequestOptions } = await import("./utils/parse.js");
    CACHE.publicKeyCredentialRequestOptionsDecoder = decodePublicKeyCredentialRequestOptions;

    return CACHE.publicKeyCredentialRequestOptionsDecoder;
  }

  async _getLoginCredentialEncoder() {
    if (typeof this.loginCredentialEncoder === "function") {
      return this.loginCredentialEncoder;
    }

    if (typeof CACHE.loginCredentialEncoder === "function") {
      return CACHE.loginCredentialEncoder;
    }

    const { encodeLoginCredential } = await import("./utils/parse.js");
    CACHE.loginCredentialEncoder = encodeLoginCredential;

    return CACHE.loginCredentialEncoder;
  }

  async _onFormSubmit(event) {
    event.preventDefault();

    if (!window.PublicKeyCredential) {
      throw new Error("Web Authentication is not supported on this platform");
    }

    this.dispatchEvent(new CustomEvent("login-started"));

    const formData = new FormData(event.target);
    const username = formData.get(this.inputName);

    try {
      const startResponse = await fetch(this.assertionStartUrl, {
        ...this.fetchOptions,
        body: JSON.stringify({ username }),
      });

      const { assertionId, publicKeyCredentialRequestOptions } = await startResponse.json();

      if (!startResponse.ok) {
        throw new Error("Could not successfuly start login");
      }

      const decodePublicKeyCredentialRequestOptions =
        await this._getPublicKeyCredentialRequestOptionsDecoder();

      const credential = await navigator.credentials.get({
        publicKey: decodePublicKeyCredentialRequestOptions(publicKeyCredentialRequestOptions),
      });

      this.dispatchEvent(new CustomEvent("login-retrieved"));

      const encodeLoginCredential = await this._getLoginCredentialEncoder();

      const finishResponse = await fetch(this.assertionFinishUrl, {
        ...this.fetchOptions,
        body: JSON.stringify({ assertionId, credential: encodeLoginCredential(credential) }),
      });

      if (!finishResponse.ok) {
        throw new Error("Could not successfuly complete login");
      }

      const jsonFinishResponse = await finishResponse.json();
      this.dispatchEvent(new CustomEvent("login-finished", { detail: jsonFinishResponse }));
    } catch (error) {
      this.dispatchEvent(new CustomEvent("login-error", { detail: { message: error.message } }));
    }
  }
}

customElements.define("web-authn-login", WebAuthnLogin);
