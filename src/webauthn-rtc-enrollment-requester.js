import { decodePublicKeyCredentialCreateOptions, encodeRegisterCredential } from "./utils/parse.js";
import { WebRTCConnection, WebSocketConnection } from "./utils/rtc.js";

export class WebAuthnRTCEnrollmentRequester extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
    this._onRequestFormSubmitListener = this._onRequestFormSubmit.bind(this);
    this._onConfirmFormSubmitListener = this._onConfirmFormSubmit.bind(this);
    this._onConfirmFormResetListener = this._onConfirmFormReset.bind(this);
    this._onAcceptUserAgreementListener = this._onAcceptUserAgreement.bind(this);
    this._onResetButtonClickListener = this._onResetButtonClick.bind(this);
    this._onEnrollmentProviderConnectedListener = this._onEnrollmentProviderConnected.bind(this);
    this._userCancelled = false;
    this.enrollmentStartUrl = "/api/registration/start";
    this.enrollmentFinishUrl = "/api/registration/finish";
    this.fetchOptions = {
      method: "POST",
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
    return [
      "request-button-text",
      "confirm-button-text",
      "agreement-text",
      "cancel-button-text",
      "peer-code",
      "registration-add-token",
    ];
  }

  connectedCallback() {
    this.update();
    this.root
      .querySelector("#request-form")
      .addEventListener("submit", this._onRequestFormSubmitListener);
    this.root
      .querySelector("#confirm-form")
      .addEventListener("submit", this._onConfirmFormSubmitListener);
    this.root
      .querySelector("#confirm-form")
      .addEventListener("reset", this._onConfirmFormResetListener);
    this.root
      .querySelector("button[type=reset]")
      .addEventListener("click", this._onResetButtonClickListener);
    this.root
      .querySelector("#user-agreement")
      .addEventListener("change", this._onAcceptUserAgreementListener);
    this.addEventListener(
      "enrollment-provider-connected",
      this._onEnrollmentProviderConnectedListener
    );
  }

  disconnectedCallback() {
    this.root
      .querySelector("#request-form")
      .removeEventListener("submit", this._onRequestFormSubmitListener);
    this.root
      .querySelector("#confirm-form")
      .removeEventListener("submit", this._onConfirmFormSubmitListener);
    this.root
      .querySelector("#confirm-form")
      .removeEventListener("reset", this._onConfirmFormResetListener);
    this.root
      .querySelector("button[type=reset]")
      .removeEventListener("click", this._onResetButtonClickListener);
    this.root
      .querySelector("#user-agreement")
      .removeEventListener("change", this._onAcceptUserAgreementListener);
    this.removeEventListener(
      "enrollment-provider-connected",
      this._onEnrollmentProviderConnectedListener
    );
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (!this.root.innerHTML) return;
    if (newValue === oldValue) return;

    const requestButton = this.root.querySelector("#request-form button");
    const confirmButton = this.root.querySelector("#confirm-form button[type=submit]");
    const cancelButton = this.root.querySelector("#confirm-form button[type=reset]");
    const agreementLabel = this.root.querySelector("#confirm-form label span");
    const code = this.root.querySelector("code");

    switch (name) {
      case "request-button-text":
        requestButton.textContent = newValue || this.requestButtonText;
        break;
      case "confirm-button-text":
        confirmButton.textContent = newValue || this.confirmButtonText;
        break;
      case "cancel-button-text":
        cancelButton.textContent = newValue || this.cancelButtonText;
        break;
      case "agreement-text":
        agreementLabel.textContent = newValue || this.agreementText;
        break;
      case "peer-code":
        code.textContent = newValue;
        this._shouldShowCode();
        break;
      case "registration-add-token":
        this._onRegistrationAddToken();
        break;
    }
  }

  update() {
    if (!this.root.innerHTML) {
      this.root.innerHTML = `
        <form id="request-form" part="form">
          <button part="button request-button" type="submit">${this.requestButtonText}</button>
          <code part="code hidden" hidden>${this.peerCode}</code>
        </form>
        <form id="confirm-form" part="form hidden" hidden>
          <label part="label" for="user-agreement">
            <input part="checkbox" id="user-agreement" type="checkbox" required>
            <span>${this.agreementText}</span>
          </label>
          <button part="button confirm-button" type="submit">${this.confirmButtonText}</button>
          <button part="button cancel-button" type="reset">${this.cancelButtonText}</button>
        </form>
      `;
    }
  }

  _shouldShowCode() {
    if (this.peerCode) {
      this.root.querySelector("code").hidden = false;
      this.root.querySelector("code").part.remove("hidden");
    } else {
      this.root.querySelector("code").hidden = true;
      this.root.querySelector("code").part.add("hidden");
    }
  }

  get requestButtonText() {
    return this.getAttribute("request-button-text") || "Generate code";
  }

  set requestButtonText(value) {
    this.setAttribute("request-button-text", value);
  }

  get confirmButtonText() {
    return this.getAttribute("confirm-button-text") || "Enroll device";
  }

  set confirmButtonText(value) {
    this.setAttribute("confirm-button-text", value);
  }

  get cancelButtonText() {
    return this.getAttribute("cancel-button-text") || "Cancel";
  }

  set cancelButtonText(value) {
    this.setAttribute("cancel-button-text", value);
  }

  get agreementText() {
    return (
      this.getAttribute("agreement-text") ||
      "I understand that this device will be added to another account"
    );
  }

  set agreementText(value) {
    this.setAttribute("agreement-text", value);
  }

  get peerCode() {
    return this.getAttribute("peer-code") || "";
  }

  set peerCode(value) {
    this.setAttribute("peer-code", value);
  }

  get registrationAddToken() {
    return this.getAttribute("registration-add-token") || "";
  }

  set registrationAddToken(value) {
    this.setAttribute("registration-add-token", value);
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

  _onRequestFormSubmit(event) {
    event.preventDefault();
    this.dispatchEvent(new CustomEvent("enrollment-code-requested"));

    this.RTC?.close();
    this.RTC = new WebRTCConnection(new WebSocketConnection(this.webSocketSignalingEndpoint), {
      iceServers: this.rtcIceServers,
    });
    this.RTC.createDataChannel();
    this.RTC.oncode = (code) => {
      this.peerCode = code;
    };
    this.RTC.onuser = async (user) => {
      await this.RTC.createOffer();
      this.agreementText = `I understand that this device will be added to ${user}'s account`;
      this.dispatchEvent(new CustomEvent("enrollment-provider-connected", { detail: user }));
    };
  }

  _onEnrollmentProviderConnected() {
    this.root.querySelector("#request-form").hidden = true;
    this.root.querySelector("#request-form").part.add("hidden");
    this.root.querySelector("#confirm-form").hidden = false;
    this.root.querySelector("#confirm-form").part.remove("hidden");
  }

  _onResetButtonClick() {
    this._userCancelled = true;
  }

  _onConfirmFormReset(event) {
    event.preventDefault();

    if (this._userCancelled) {
      this.dispatchEvent(new CustomEvent("enrollment-cancelled"));
      this.RTC?.sendData("action::cancel");
      this._userCancelled = false;
    }

    this.RTC?.close();
    this.peerCode = "";
    this.root.querySelector("#request-form").hidden = false;
    this.root.querySelector("#request-form").part.remove("hidden");
    this.root.querySelector("#confirm-form").hidden = true;
    this.root.querySelector("#confirm-form").part.add("hidden");
  }

  _onAcceptUserAgreement(event) {
    if (event.target.checked) {
      this.RTC?.sendData("action::add");
      this.dispatchEvent(new CustomEvent("enrollment-agreement-accepted"));
    } else {
      this.dispatchEvent(new CustomEvent("enrollment-agreement-declined"));
    }

    if (!this.RTC.ondatachannelmessage) {
      this.RTC.ondatachannelmessage = (event) => {
        const [type, data] = event.data.split("::");

        if (type === "token") {
          this.registrationAddToken = data;
        }
      };
      this.RTC.listenForData();
    }
  }

  _onRegistrationAddToken() {
    if (this.registrationAddToken) {
      this.dispatchEvent(new CustomEvent("enrollment-registration-token-received"));
    }
  }

  async _onConfirmFormSubmit(event) {
    try {
      event.preventDefault();

      if (!window.PublicKeyCredential) {
        throw new Error("Web Authentication is not supported on this platform");
      }

      if (!this.registrationAddToken) return;

      this.dispatchEvent(new CustomEvent("enrollment-started"));

      const startResponse = await fetch(this.enrollmentStartUrl, {
        ...this.fetchOptions,
        body: JSON.stringify({ registrationAddToken: this.registrationAddToken }),
      });

      const { registrationId, publicKeyCredentialCreationOptions } = await startResponse.json();

      if (!startResponse.ok) {
        throw new Error("Could not successfuly start enrollment");
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
      this.dispatchEvent(new CustomEvent("enrollment-completed", { detail: jsonFinishResponse }));
      this.RTC.dataChannel.send("event::complete");
      this.registrationAddToken = "";
      this.root.querySelector("#confirm-form").reset();
    } catch (error) {
      this.dispatchEvent(
        new CustomEvent("enrollment-error", { detail: { message: error.message } })
      );
      this.RTC?.sendData("action::cancel");
      this.RTC?.close();
    }
  }
}

window.customElements.define("webauthn-rtc-enrollment-requester", WebAuthnRTCEnrollmentRequester);
