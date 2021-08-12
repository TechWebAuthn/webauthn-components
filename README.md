# Web Components for the Web Authentication API

A collection of Web Components that make the Web Authentication API a little easier to use.

- [web-authn-login](#web-authn-login)

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
<summary><b>✏️ buttonText</b></summary>

_The text displayed on the login button_

- type: `String`
- default: `Login`
- reflected attribute: `button-text`
</details>

<details>
<summary><b>⚙️ fetchOptions</b></summary>

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
