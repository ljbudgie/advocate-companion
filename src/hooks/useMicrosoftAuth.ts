import { useCallback, useRef } from "react";
import {
  PublicClientApplication,
  type Configuration,
  type PopupRequest,
} from "@azure/msal-browser";

const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID ?? "",
    authority: "https://login.microsoftonline.com/consumers",
  },
};

const loginRequest: PopupRequest = {
  scopes: ["Mail.Read", "Mail.Send"],
};

let msalInstance: PublicClientApplication | null = null;

function getMsalInstance(): PublicClientApplication {
  if (!msalInstance) {
    msalInstance = new PublicClientApplication(msalConfig);
  }
  return msalInstance;
}

export function useMicrosoftAuth() {
  const initializedRef = useRef(false);

  const signIn = useCallback(async (): Promise<string> => {
    const instance = getMsalInstance();

    if (!initializedRef.current) {
      await instance.initialize();
      initializedRef.current = true;
    }

    const result = await instance.loginPopup(loginRequest);
    return result.accessToken;
  }, []);

  return { signIn };
}
