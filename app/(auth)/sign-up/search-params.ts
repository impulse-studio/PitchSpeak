import { createSearchParamsCache, parseAsString } from "nuqs/server";

export const signUpParsers = {
  signUpEmail: parseAsString.withDefault(""),
};

export const signUpSearchParams = createSearchParamsCache(signUpParsers);
