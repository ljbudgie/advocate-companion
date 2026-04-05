import { useCallback } from "react";
import {
  PublicClientApplication,
  type Configuration,
  type PopupRequest,
} from "@azure/msal-browser";

const clientId = import.meta.env.VITE_AZURE_CLIENT_ID;

const msalConfig: Configuration = {
  auth: {
    clientId: clientId ?? "",
    authority: "https://login.microsoftonline.com/consumers",
  },
};

const loginRequest: PopupRequest = {
  scopes: ["Mail.Read", "Mail.Send"],
};

let msalInstance: PublicClientApplication | null = null;
let initPromise: Promise<void> | null = null;

function getMsalInstance(): PublicClientApplication {
  if (!msalInstance) {
    msalInstance = new PublicClientApplication(msalConfig);
  }
  return msalInstance;
}

function ensureInitialized(instance: PublicClientApplication): Promise<void> {
  if (!initPromise) {
    initPromise = instance.initialize();
  }
  return initPromise;
}

export function useMicrosoftAuth() {
  const signIn = useCallback(async (): Promise<string> => {
    if (!clientId) {
      throw new Error(
        "VITE_AZURE_CLIENT_ID is not set. Please configure the environment variable.",
      );
    }

    const instance = getMsalInstance();
    await ensureInitialized(instance);

    const result = await instance.loginPopup(loginRequest);
    return result.accessToken;
  }, []);

  return { signIn };
}
