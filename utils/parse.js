/**
 * @param {String} base64UrlString
 * @returns {ArrayBuffer} Decoded ArrayBuffer value
 */
export function base64UrlStringToUint8Array(base64UrlString) {
  if (!base64UrlString) return null;

  const padding = "==".slice(0, (4 - (base64UrlString.length % 4)) % 4);
  const base64String = base64UrlString.replace(/-/g, "+").replace(/_/g, "/") + padding;

  const string = window.atob(base64String);

  return Uint8Array.from(string, (c) => c.charCodeAt(0));
}

/**
 * @param {ArrayBuffer} arrayBuffer
 * @returns {String} Encoded Base64URLString value
 */
export function arrayBufferToBase64UrlString(arrayBuffer) {
  if (!arrayBuffer) return null;

  const characters = [];
  for (const char of new Uint8Array(arrayBuffer)) {
    characters.push(String.fromCharCode(char));
  }
  const base64String = window.btoa(characters.join(""));
  const base64UrlString = base64String.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  return base64UrlString;
}

/**
 * @param {Credential} credential PublicKeyCredential instance
 * @returns {Credential} Encoded Credential from ArrayBuffer to Base64URLString
 */
export function encodeRegisterCredential(credential) {
  return {
    id: credential.id,
    type: credential.type,
    rawId: arrayBufferToBase64UrlString(credential.rawId),
    response: {
      attestationObject: arrayBufferToBase64UrlString(credential.response.attestationObject),
      clientDataJSON: arrayBufferToBase64UrlString(credential.response.clientDataJSON),
    },
    clientExtensionResults: credential.getClientExtensionResults(),
  };
}

/**
 * @param {Credential} credential PublicKeyCredential instance
 * @returns {Credential} Encoded Credential from ArrayBuffer to Base64URLString
 */
export function encodeLoginCredential(credential) {
  return {
    id: credential.id,
    type: credential.type,
    rawId: arrayBufferToBase64UrlString(credential.rawId),
    response: {
      authenticatorData: arrayBufferToBase64UrlString(credential.response.authenticatorData),
      clientDataJSON: arrayBufferToBase64UrlString(credential.response.clientDataJSON),
      signature: arrayBufferToBase64UrlString(credential.response.signature),
      userHandle: arrayBufferToBase64UrlString(credential.response.userHandle),
    },
    clientExtensionResults: credential.getClientExtensionResults(),
  };
}

/**
 * @param {PublicKeyCredentialCreationOptions} pubKeyCreateOptions
 * @returns {PublicKeyCredentialCreationOptions} Decoded PublicKeyCredentialCreationOptions from Base64URLString to ArrayBuffer
 */
export function decodePublicKeyCredentialCreateOptions(pubKeyCreateOptions) {
  return {
    ...pubKeyCreateOptions,
    user: {
      ...pubKeyCreateOptions.user,
      id: base64UrlStringToUint8Array(pubKeyCreateOptions.user.id),
    },
    challenge: base64UrlStringToUint8Array(pubKeyCreateOptions.challenge),
    excludeCredentials: (pubKeyCreateOptions.excludeCredentials || []).map((excred) => ({
      ...excred,
      id: base64UrlStringToUint8Array(excred.id),
    })),
  };
}

/**
 * @param {PublicKeyCredentialRequestOptions} pubKeyRequestOptions
 * @returns {PublicKeyCredentialRequestOptions} Decoded PublicKeyCredentialRequestOptions from Base64URLString to ArrayBuffer
 */
export function decodePublicKeyCredentialRequestOptions(pubKeyRequestOptions) {
  return {
    ...pubKeyRequestOptions,
    challenge: base64UrlStringToUint8Array(pubKeyRequestOptions.challenge),
    allowCredentials: (pubKeyRequestOptions.allowCredentials || []).map((cred) => ({
      ...cred,
      id: base64UrlStringToUint8Array(cred.id),
    })),
  };
}
