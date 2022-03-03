import App from "./app";
import "./css/styles.css";

const $app = document.querySelector("#app");

new App({ $target: $app }).mount();
