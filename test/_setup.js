import { JSDOM } from "jsdom";

const window = new JSDOM().window;
window.PublicKeyCredential = () => {};

global.window = window;
global.document = window.document;
global.HTMLElement = window.HTMLElement;
global.Promise = window.Promise;
global.CustomEvent = window.CustomEvent;
global.FormData = window.FormData;
