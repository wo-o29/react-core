import App from "./App.tsx";

const app = App();

const appStr = JSON.stringify(app, null, 3);
document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <pre>${appStr}</pre>
`;
