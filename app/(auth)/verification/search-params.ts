import { createSearchParamsCache, parseAsString } from "nuqs/server";

export const emailParsers = {
  email: parseAsString.withDefault(""),
  otp: parseAsString,
};

export const searchParamsCache = createSearchParamsCache(emailParsers);
