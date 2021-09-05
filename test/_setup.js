import { Window } from "happy-dom";

global.window = new Window();
global.document = window.document;
global.HTMLElement = window.HTMLElement;
global.Promise = window.Promise;
