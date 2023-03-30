import type { ActivateBrowserWallet } from "@usedapp/core/dist/esm/src/providers";
import React from "react";

interface AppContextInterface{
    activateBrowserWallet: ActivateBrowserWallet;
    account: string | undefined;
}
export const AppContext = React.createContext<AppContextInterface>({
    activateBrowserWallet: (arg?: { type: string }) => {},
    account: undefined
});