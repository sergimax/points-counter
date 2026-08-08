import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppThemeProvider } from "./components/app-theme-provider/index.tsx";
import { LocaleProvider } from "./i18n/locale-provider.tsx";
import { RootStoreProvider } from "./stores/root-store-provider.tsx";
import "./index.css";
import "./theme/links.css";
import App from "./App.tsx";

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
