import test from "ava";
import "../src/web-authn-login.js";

test.beforeEach((t) => {
  t.context = {
    component: document.body.appendChild(document.createElement("web-authn-login")),
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

test.afterEach((t) => {
  t.context.component.remove();
});
