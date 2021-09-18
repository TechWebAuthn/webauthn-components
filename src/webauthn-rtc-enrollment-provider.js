import { WebRTCConnection, WebSocketConnection } from "./utils/rtc.js";

export class WebAuthnRTCEnrollmentProvider extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
    this._onFormSubmitListener = this._onFormSubmit.bind(this);
    this._onRequestedEnrollmentListener = this._onRequestedEnrollment.bind(this);
    this.enrollmentTokenUrl = "/api/registration/add";
    this.fetchOptions = {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    };
    this.webSocketSignalingEndpoint = "/api/socket";
    this.RTC = null;
    this.rtcIceServers = [{ urls: "stun:stun.services.mozilla.com" }];
  }

  static get observedAttributes() {
    return ["label", "input-type", "input-name", "button-text"];
  }

  connectedCallback() {
    this.update();
    this.root.querySelector("form").addEventListener("submit", this._onFormSubmitListener);
    this.addEventListener("enrollment-requested", this._onRequestedEnrollmentListener);
  }

  disconnectedCallback() {
    this.root.querySelector("form").removeEventListener("submit", this._onFormSubmitListener);
    this.removeEventListener("enrollment-requested", this._onRequestedEnrollmentListener);
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
    return this.getAttribute("label") || "Code";
  }

  set label(value) {
    this.setAttribute("label", value);
  }

  get buttonText() {
    return this.getAttribute("button-text") || "Connect";
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
    return this.getAttribute("input-name") || "code";
  }

  set inputName(value) {
    this.setAttribute("input-name", value);
  }

  async _onFormSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const code = formData.get(this.inputName).toUpperCase();

    this.dispatchEvent(new CustomEvent("enrollment-started"));

    this.RTC?.close();

    this.RTC = new WebRTCConnection(new WebSocketConnection(this.webSocketSignalingEndpoint), {
      iceServers: this.rtcIceServers,
    });
    this.RTC.listenForData();
    this.RTC.signaling.send({ code });

    this.RTC.ondatachannelmessage = async (event) => {
      const [type, data] = event.data.split("::");

      if (type === "action" && data === "add") {
        this.dispatchEvent(new CustomEvent("enrollment-requested"));
      }

      if (type === "action" && data === "cancel") {
        this.dispatchEvent(new CustomEvent("enrollment-cancelled"));
      }

      if (type === "event" && data === "complete") {
        this.dispatchEvent(new CustomEvent("enrollment-completed"));
      }
    };
  }

  async _onRequestedEnrollment() {
    try {
      const response = await fetch(this.enrollmentTokenUrl, this.fetchOptions);

      const jsonResponse = await response.json();

      if (!response.ok) {
        throw new Error("Could not successfuly retrieve enrollment token");
      }

      this.RTC.sendData(`token::${jsonResponse.registrationAddToken}`);
      this.dispatchEvent(new CustomEvent("enrollment-provided", { detail: jsonResponse }));
    } catch (error) {
      this.dispatchEvent(
        new CustomEvent("enrollment-error", { detail: { message: error.message } })
      );
    }

    this.root.querySelector("input").value = "";
  }
}

window.customElements.define("webauthn-rtc-enrollment-provider", WebAuthnRTCEnrollmentProvider);
