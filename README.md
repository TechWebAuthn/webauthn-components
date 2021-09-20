# Web Components for the Web Authentication API

A collection of Web Components that make the Web Authentication API a little easier to use.

## Installation

```bash
npm i webauthn-components
```

These components use CSS [`::part`](https://developer.mozilla.org/en-US/docs/Web/CSS/::part) to enable styling

## Components

- [webauthn-login](#webauthn-login)
- [webauthn-registration](#webauthn-registration)
- [webauthn-recovery](#webauthn-recovery)
- [webauthn-enrollment-requester](#webauthn-enrollment-requester)
- webauthn-enrollment-provider
- webauthn-rtc-enrollment-requester
- webauthn-rtc-enrollment-provider

## **webauthn-login**

_Used for connecting with a previously registered account_

### **Usage**

with default values

```js
import "webauthn-components/login";

/* html */
<webauthn-login></webauthn-login>;
```

with custom values

```js
import "webauthn-components/login";

/* html */
<webauthn-login label="Email" input-type="email" input-name="email"></webauthn-login>;
```

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

### **Styling**

<details>
<summary><b>🎨 ::part(form)</b></summary>

_Exposes the `form` element for styling_

```css
webauthn-login::part(form) {...}
```
</details>

<details>
<summary><b>🎨 ::part(label)</b></summary>

_Exposes the `label` element for styling_

```css
webauthn-login::part(label) {...}
```
</details>

<details>
<summary><b>🎨 ::part(input)</b></summary>

_Exposes the `input` element for styling_

```css
webauthn-login::part(input) {...}
```
</details>

<details>
<summary><b>🎨 ::part(button)</b></summary>

_Exposes the `button` element for styling_

```css
webauthn-login::part(button) {...}
```
</details>

---

## **webauthn-registration**

_Used for creating a new account_

### **Usage**

with default values

```js
import "webauthn-components/registration";

/* html */
<webauthn-registration></webauthn-registration>;
```

with custom values

```js
import "webauthn-components/registration";

/* html */
<webauthn-registration label="Email" input-type="email" input-name="email"></webauthn-registration>;

const registrationComponent = document.querySelector("webauthn-registration");
registrationComponent.fetchOptions = { ...registrationComponent.fetchOptions, cache: "no-cache" };
```

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

### **Styling**

<details>
<summary><b>🎨 ::part(form)</b></summary>

_Exposes the `form` element for styling_

```css
webauthn-registration::part(form) {...}
```
</details>

<details>
<summary><b>🎨 ::part(label)</b></summary>

_Exposes the `label` element for styling_

```css
webauthn-registration::part(label) {...}
```
</details>

<details>
<summary><b>🎨 ::part(input)</b></summary>

_Exposes the `input` element for styling_

```css
webauthn-registration::part(input) {...}
```
</details>

<details>
<summary><b>🎨 ::part(button)</b></summary>

_Exposes the `button` element for styling_

```css
webauthn-registration::part(button) {...}
```
</details>

---

## **webauthn-recovery**

_Used for recovering access to an existing account_

### **Usage**

with default values

```js
import "webauthn-components/recovery";

/* html */
<webauthn-recovery></webauthn-recovery>;
```

with custom values

```js
import "webauthn-components/recovery";

/* html */
<webauthn-recovery label="Recovery code" input-type="number" input-name="code"></webauthn-recovery>;

const recoveryComponent = document.querySelector("webauthn-recovery");
recoveryComponent.fetchOptions = { ...recoveryComponent.fetchOptions, cache: "no-cache" };
```

### **Properties**

<details>
<summary><b>⚙️ recoveryStartUrl</b></summary>

_Endpoint for retrieving initial details and challenge from the server_

- type: `String`
- default: `/api/registration/start`
</details>

<details>
<summary><b>⚙️ recoveryFinishUrl</b></summary>

_Endpoint for completing the recovery process_

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

_The text displayed on the recovery button_

- type: `String`
- default: `Recover`
- reflected attribute: `button-text`
</details>

<details>
<summary><b>⚙️ inputType</b></summary>

_The type of input to use for the recovery token_

- type: `String`
- default: `text` (any valid HTML input type)
- reflected attribute: `input-type`
</details>

<details>
<summary><b>⚙️ inputName</b></summary>

_The name of the input to use for the recovery token_

- type: `String`
- default: `recovery-token`
- reflected attribute: `input-name`
</details>

<details>
<summary><b>✏️ label</b></summary>

_Recovery token label content_

- type: `String`
- default: `Recovery token`
- reflected attribute: `label`
</details>

### **Events**

<details>
<summary><b>🔼 recovery-started</b></summary>

_Emitted when the recovery process starts (i.e. on form submit)_

- type: `CustomEvent`
- detail: `null`
</details>

<details>
<summary><b>🔼 recovery-created</b></summary>

_Emitted after creating the local credentials using `navigator.credentials.create()`_

- type: `CustomEvent`
- detail: `null`
</details>

<details>
<summary><b>🔼 recovery-finished</b></summary>

_Emitted when the recovery process is completed succesfully_

- type: `CustomEvent`
- detail: `{...}` (content returned by the `registrationFinishUrl` endpoint)
</details>

<details>
<summary><b>🔼 recovery-error</b></summary>

_Emitted when the recovery process is interrupted by an error_

- type: `CustomEvent`
- detail: `{ message: String }`
</details>

### **Styling**

<details>
<summary><b>🎨 ::part(form)</b></summary>

_Exposes the `form` element for styling_

```css
webauthn-recovery::part(form) {...}
```
</details>

<details>
<summary><b>🎨 ::part(label)</b></summary>

_Exposes the `label` element for styling_

```css
webauthn-recovery::part(label) {...}
```
</details>

<details>
<summary><b>🎨 ::part(input)</b></summary>

_Exposes the `input` element for styling_

```css
webauthn-recovery::part(input) {...}
```
</details>

<details>
<summary><b>🎨 ::part(button)</b></summary>

_Exposes the `button` element for styling_

```css
webauthn-recovery::part(button) {...}
```
</details>

---

## **webauthn-enrollment-requester**

_Used for initiating the enrollment flow, which adds a new device to an existing account_

### **Usage**

with default values

```js
import "webauthn-components/enrollment-requester";

/* html */
<webauthn-enrollment-requester></webauthn-enrollment-requester>;
```

with custom values

```js
import "webauthn-components/enrollment-requester";

/* html */
<webauthn-enrollment-requester label="Enrollment code" input-type="number" input-name="code"></webauthn-enrollment-requester>;

const enrollmentComponent = document.querySelector("webauthn-enrollment-requester");
enrollmentComponent.fetchOptions = { ...enrollmentComponent.fetchOptions, cache: "no-cache" };
```

### **Properties**

<details>
<summary><b>⚙️ enrollmentStartUrl</b></summary>

_Endpoint for retrieving initial details and challenge from the server_

- type: `String`
- default: `/api/registration/start`
</details>

<details>
<summary><b>⚙️ enrollmentFinishUrl</b></summary>

_Endpoint for completing the recovery process_

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

_The text displayed on the enrollment button_

- type: `String`
- default: `Enroll device`
- reflected attribute: `button-text`
</details>

<details>
<summary><b>⚙️ inputType</b></summary>

_The type of input to use for the enrollment token_

- type: `String`
- default: `text` (any valid HTML input type)
- reflected attribute: `input-type`
</details>

<details>
<summary><b>⚙️ inputName</b></summary>

_The name of the input to use for the enrollment token_

- type: `String`
- default: `registration-add-token`
- reflected attribute: `input-name`
</details>

<details>
<summary><b>✏️ label</b></summary>

_Enrollment token label content_

- type: `String`
- default: `Enrollment token`
- reflected attribute: `label`
</details>

### **Events**

<details>
<summary><b>🔼 enrollment-requested</b></summary>

_Emitted when the enrollment process starts (i.e. on form submit)_

- type: `CustomEvent`
- detail: `null`
</details>

<details>
<summary><b>🔼 enrollment-created</b></summary>

_Emitted after creating the local credentials using `navigator.credentials.create()`_

- type: `CustomEvent`
- detail: `null`
</details>

<details>
<summary><b>🔼 enrollment-finished</b></summary>

_Emitted when the enrollment process is completed succesfully_

- type: `CustomEvent`
- detail: `{...}` (content returned by the `registrationFinishUrl` endpoint)
</details>

<details>
<summary><b>🔼 enrollment-error</b></summary>

_Emitted when the enrollment process is interrupted by an error_

- type: `CustomEvent`
- detail: `{ message: String }`
</details>

### **Styling**

<details>
<summary><b>🎨 ::part(form)</b></summary>

_Exposes the `form` element for styling_

```css
webauthn-enrollment-requester::part(form) {...}
```
</details>

<details>
<summary><b>🎨 ::part(label)</b></summary>

_Exposes the `label` element for styling_

```css
webauthn-enrollment-requester::part(label) {...}
```
</details>

<details>
<summary><b>🎨 ::part(input)</b></summary>

_Exposes the `input` element for styling_

```css
webauthn-enrollment-requester::part(input) {...}
```
</details>

<details>
<summary><b>🎨 ::part(button)</b></summary>

_Exposes the `button` element for styling_

```css
webauthn-enrollment-requester::part(button) {...}
```
</details>

---

## License

MIT License

> A short and simple permissive license with conditions only requiring preservation of copyright and license notices. Licensed works, modifications, and larger works may be distributed under different terms and without source code.

Refer to the [LICENSE](LICENSE) file for the complete text.
