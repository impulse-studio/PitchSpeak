export const MARKETING_PAGES = {
  LANDING_PAGE: "/",
  ABOUT: "/about",
  CONTACT: "/contact",
  PRIVACY_POLICY: "/privacy-policy",
  TERMS_OF_SERVICE: "/terms-of-service",
  FAQ: "/faq",
};

export const AUTH_PAGES = {
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  VERIFICATION: "/verification",
};

export const APPLICATION_PAGES = {
  DASHBOARD: "/dashboard",
};

export const PAGES = {
  ...MARKETING_PAGES,
  ...APPLICATION_PAGES,
  ...AUTH_PAGES,
};
