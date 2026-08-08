import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import { AppThemeProvider } from "./components/app-theme-provider/index.tsx";
import { LocaleProvider } from "./i18n/locale-provider.tsx";
import { RootStoreProvider } from "./stores/root-store-provider.tsx";
import "./theme/fonts.css";
import "./index.css";
import "./theme/links.css";
import App from "./App.tsx";

registerSW({ immediate: true });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppThemeProvider>
      <LocaleProvider>
        <RootStoreProvider>
          <App />
        </RootStoreProvider>
      </LocaleProvider>
    </AppThemeProvider>
  </StrictMode>,
);
