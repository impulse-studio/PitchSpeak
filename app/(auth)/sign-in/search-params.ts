import { createSearchParamsCache, parseAsString } from "nuqs/server";

export const messageParsers = {
  message: parseAsString.withDefault(""),
  error: parseAsString.withDefault(""),
  callbackUrl: parseAsString.withDefault(""),
};

export const searchParamsCache = createSearchParamsCache(messageParsers);
