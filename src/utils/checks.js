import { isNotDefined } from "./validations";

export function isServer() {
    try {
        if (typeof window === "undefined") return true;
        return false;
    } catch (error) {
        console.error("In Checks.js: ", error);
    }
}

export function isClient() {
    return !isServer();
}
