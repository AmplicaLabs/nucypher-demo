import type { ActivateBrowserWallet } from "@usedapp/core/dist/esm/src/providers";
import React from "react";

interface AppContextInterface{
    isBob: boolean;
    isCharlie: boolean;
    msg: string;
    activateBrowserWallet: ActivateBrowserWallet;
    account: string | undefined;
}
export const AppContext = React.createContext<AppContextInterface>({
    isBob: false,
    isCharlie: false,
    msg: "",
    activateBrowserWallet: (arg?: { type: string }) => {},
    account: undefined
});