# Web Components for the Web Authentication API

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg?style=flat-square)](https://www.webcomponents.org/element/TechWebAuthn/web-authn-components)

A collection of Web Components that make the Web Authentication API a little easier to use.

## Installation

```bash
npm i web-authn-components
```

## Components

- [web-authn-login](#web-authn-login)
- [web-authn-registration](#web-authn-registration)
- web-authn-recovery
- web-authn-enrollment-requester
- web-authn-enrollment-provider
- web-authn-rtc-enrollment-requester
- web-authn-rtc-enrollment-provider

## **web-authn-login**

_Used for connecting with a previously registered account_

### **Properties**

<details>
<summary><b>⚙️ assertionStartUrl</b></summary>

_Endpoint for retrieving details and challenge from the server_

- type: `String`
- default: `/api/assertion/start`
</details>

<details>
<summary><b>⚙️ assertionFinishUrl</b></summary>

_Endpoint for completing the assertion process and sending the challenge result to the server_

- type: `String`
- default: `/api/assertion/finish`
</details>

<details>
<summary><b>⚙️ fetchOptions</b></summary>

_Fetch options used for all request within this component_

- type: `Object`
- default:

```json
{
  "method": "POST",
  "credentials": "include",
  "headers": {
    "Content-Type": "application/json"
  }
}
```

</details>

<details>
<summary><b>⚙️ publicKeyCredentialRequestOptionsDecoder</b></summary>

_PublicKeyCredentialRequestOptions decoding function (i.e. Base64URLString to ArrayBuffer)_

- type: `Function`
- default: `decodePublicKeyCredentialRequestOptions` from `utils/parse`
</details>

<details>
<summary><b>⚙️ loginCredentialEncoder</b></summary>

_Credential encoding function (i.e. ArrayBuffer to Base64URLString)_

- type: `Function`
- default: `encodeLoginCredential` from `utils/parse`
</details>

<details>
<summary><b>✏️ buttonText</b></summary>

_The text displayed on the login button_

- type: `String`
- default: `Login`
- reflected attribute: `button-text`
</details>

<details>
<summary><b>⚙️ inputType</b></summary>

_The type of input to use for the username_

- type: `String`
- default: `text` (any valid HTML input type)
- reflected attribute: `input-type`
</details>

<details>
<summary><b>⚙️ inputName</b></summary>

_The name of the input to use for the username_

- type: `String`
- default: `username`
- reflected attribute: `input-name`
</details>

<details>
<summary><b>✏️ label</b></summary>

_Username label content_

- type: `String`
- default: `Username`
- reflected attribute: `label`
</details>

<details>
<summary><b>⚙️ noUsername</b></summary>

_Should login be done without a username_

- type: `Boolean`
- default: `false`
- reflected attribute: `no-username`
</details>

### **Events**

<details>
<summary><b>🔼 login-started</b></summary>

_Emitted when the login process starts (i.e. on form submit)_

- type: `CustomEvent`
- detail: `null`
</details>

<details>
<summary><b>🔼 login-retrieved</b></summary>

_Emitted when retrieving the local credentials using `navigator.credentials.get()`_

- type: `CustomEvent`
- detail: `null`
</details>

<details>
<summary><b>🔼 login-finished</b></summary>

_Emitted when the login process is completed succesfully_

- type: `CustomEvent`
- detail: `{...}` (content returned by the `assertionFinishUrl` endpoint)
</details>

<details>
<summary><b>🔼 login-error</b></summary>

_Emitted when the login process is interrupted by an error_

- type: `CustomEvent`
- detail: `{ message: String }`
</details>

### **Usage**

with default values

```js
import "web-authn-components/login";

/* html */
<web-authn-login></web-authn-login>
```

<!--
```
<custom-element-demo>
  <template>
    <script src="./src/web-authn-login.js"></script>
    <web-authn-login></web-authn-login>
  </template>
</custom-element-demo>
```
-->

with custom values

```js
import "web-authn-components/login";

/* html */
<web-authn-login label="Email" input-type="email" input-name="email"></web-authn-login>
```

-----------------------------

## **web-authn-registration**

_Used for creating a new account_

### **Properties**

<details>
<summary><b>⚙️ registrationStartUrl</b></summary>

_Endpoint for retrieving initial details and challenge from the server_

- type: `String`
- default: `/api/registration/start`
</details>

<details>
<summary><b>⚙️ registrationFinishUrl</b></summary>

_Endpoint for completing the registration process_

- type: `String`
- default: `/api/registration/finish`
</details>

<details>
<summary><b>⚙️ fetchOptions</b></summary>

_Fetch options used for all request within this component_

- type: `Object`
- default:

```json
{
  "method": "POST",
  "credentials": "include",
  "headers": {
    "Content-Type": "application/json"
  }
}
```

</details>

<details>
<summary><b>⚙️ publicKeyCredentialCreateOptionsDecoder</b></summary>

_PublicKeyCredentialCreateOptions decoding function (i.e. Base64URLString to ArrayBuffer)_

- type: `Function`
- default: `decodePublicKeyCredentialCreateOptions` from `utils/parse`
</details>

<details>
<summary><b>⚙️ registerCredentialEncoder</b></summary>

_Credential encoding function (i.e. ArrayBuffer to Base64URLString)_

- type: `Function`
- default: `encodeRegisterCredential` from `utils/parse`
</details>

<details>
<summary><b>✏️ buttonText</b></summary>

_The text displayed on the login button_

- type: `String`
- default: `Login`
- reflected attribute: `button-text`
</details>

<details>
<summary><b>⚙️ inputType</b></summary>

_The type of input to use for the username_

- type: `String`
- default: `text` (any valid HTML input type)
- reflected attribute: `input-type`
</details>

<details>
<summary><b>⚙️ inputName</b></summary>

_The name of the input to use for the username_

- type: `String`
- default: `username`
- reflected attribute: `input-name`
</details>

<details>
<summary><b>✏️ label</b></summary>

_Username label content_

- type: `String`
- default: `Username`
- reflected attribute: `label`
</details>

<details>
<summary><b>⚙️ noUsername</b></summary>

_Should login be done without a username_

- type: `Boolean`
- default: `false`
- reflected attribute: `no-username`
</details>

### **Events**

<details>
<summary><b>🔼 registration-started</b></summary>

_Emitted when the registration process starts (i.e. on form submit)_

- type: `CustomEvent`
- detail: `null`
</details>

<details>
<summary><b>🔼 registration-created</b></summary>

_Emitted after creating the local credentials using `navigator.credentials.create()`_

- type: `CustomEvent`
- detail: `null`
</details>

<details>
<summary><b>🔼 registration-finished</b></summary>

_Emitted when the registration process is completed succesfully_

- type: `CustomEvent`
- detail: `{...}` (content returned by the `registrationFinishUrl` endpoint)
</details>

<details>
<summary><b>🔼 registration-error</b></summary>

_Emitted when the registration process is interrupted by an error_

- type: `CustomEvent`
- detail: `{ message: String }`
</details>

### **Usage**

with default values

```js
import "web-authn-components/registration";

/* html */
<web-authn-registration></web-authn-registration>
```

<!--
```
<custom-element-demo>
  <template>
    <script src="./src/web-authn-registration.js"></script>
    <web-authn-registration></web-authn-registration>
  </template>
</custom-element-demo>
```
-->

with custom values

```js
import "web-authn-components/registration";

/* html */
<web-authn-registration label="Email" input-type="email" input-name="email"></web-authn-registration>

const registrationComponent = document.querySelector('web-authn-registration');
registrationComponent.fetchOptions = { ...registrationComponent.fetchOptions, cache: 'no-cache' };
```

## License

MIT License

> A short and simple permissive license with conditions only requiring preservation of copyright and license notices. Licensed works, modifications, and larger works may be distributed under different terms and without source code.

Refer to the [LICENSE](LICENSE) file for the complete text.
