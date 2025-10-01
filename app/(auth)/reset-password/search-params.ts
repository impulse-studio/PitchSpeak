import { createSearchParamsCache, parseAsString } from "nuqs/server";

export const resetPasswordParsers = {
  error: parseAsString,
  token: parseAsString,
};

export const searchParamsCache = createSearchParamsCache(resetPasswordParsers);
