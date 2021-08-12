# Web Components for the Web Authentication API

A collection of Web Components that make the Web Authentication API a little easier to use.

- [web-authn-login](#web-authn-login)

## **web-authn-login**

_Used for connecting with a previously registered account_

### **Properties**

<details>
<summary><code>⚙️ assertionStartUrl</code></summary>

_Endpoint for retrieving details and challenge from the server_

- type: `String`
- default: `/api/assertion/start`
</details>

<details>
<summary><code>⚙️ assertionFinishUrl</code></summary>

_Endpoint for completing the assertion process and sending the challenge result to the server_

- type: `String`
- default: `/api/assertion/finish`
</details>

<details>
<summary><code>✏️ buttonText</code></summary>

_The text displayed on the login button_

- type: `String`
- default: `Login`
- refflected attribute: `button-text`
</details>

<details>
<summary><code>⚙️ fetchOptions</code></summary>

_Fetch options used for all request within this component_

- type: `Object`
- default:

```json
{
  "‎method": "POST",
  "‎credentials":‏‏‎ ‎"include",
  "headers":‏‏‎ ‎{
    ‎"Content-Type":‏‏‎ "application/json"
  ‎}
}
```

</details>

<details>
<summary><code>⚙️ inputType</code></summary>

_The type of input to use for the username_

- type: `String`
- default: `text` (any valid HTML input type)
- refflected attribute: `input-type`
</details>

<details>
<summary><code>⚙️ inputName</code></summary>

_The name of the input to use for the username_

- type: `String`
- default: `username`
- refflected attribute: `input-name`
</details>

<details>
<summary><code>✏️ label</code></summary>

_Username label content_

- type: `String`
- default: `Username`
- refflected attribute: `label`
</details>

<details>
<summary><code>⚙️ noUsername</code></summary>

_Should login be done without a username_

- type: `Boolean`
- default: `false`
- refflected attribute: `no-username`
</details>

### **Usage**

with default values

```js
import "web-authn-components/login";

/* html */
<web-authn-login></web-authn-login>;
```

with custom values

```js
import "web-authn-components/login";

/* html */
<web-authn-login label="Email" input-type="email" input-name="email"></web-authn-login>;
```
