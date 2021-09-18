import test from "ava";
import "../src/webauthn-login.js";

test.beforeEach((t) => {
  t.context = {
    component: document.body.appendChild(document.createElement("webauthn-login")),
  };
});

test("default button text is set correctly", (t) => {
  const { component } = t.context;
  t.is(component.root.querySelector("button").textContent, component.buttonText);
});

test("default label text is set correctly", (t) => {
  const { component } = t.context;
  t.is(component.root.querySelector("label").textContent, component.label);
});

test("default input name is set correctly", (t) => {
  const { component } = t.context;
  t.is(component.root.querySelector("input").name, component.inputName);
});

test("default input type is set correctly", (t) => {
  const { component } = t.context;
  t.is(component.root.querySelector("input").type, component.inputType);
});

test("when the username is not filled in, the form is marked as invalid", (t) => {
  const { component } = t.context;
  t.is(component.root.querySelector("form").reportValidity(), false);
});

test("when the username is filled in, the form is marked as valid", (t) => {
  const { component } = t.context;
  component.root.querySelector("input").value = "user";
  t.is(component.root.querySelector("form").reportValidity(), true);
});

test("when the form is submitted, the `login-started` event is fired", (t) => {
  t.plan(1);
  const { component } = t.context;
  component.root.querySelector("input").value = "user";
  component.addEventListener("login-started", () => {
    t.pass();
  });
  component.root.querySelector("form").submit();
});

test("when `no-username` is set, the component does not display the input field and label", (t) => {
  const { component } = t.context;
  component.setAttribute("no-username", "");
  t.is(component.root.querySelector("input").hidden, true);
  t.is(component.root.querySelector("label").hidden, true);
});

test.afterEach((t) => {
  t.context.component.remove();
});
