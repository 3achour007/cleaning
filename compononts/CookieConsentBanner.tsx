// compononts/CookieConsentBanner.tsx
"use client"; // Mark this as a Client Component

import CookieConsent from "react-cookie-consent";

export default function CookieConsentBanner() {
  return (
    <CookieConsent
      location="bottom"
      buttonText="Accept"
      declineButtonText="Decline"
      cookieName="myCookieConsent"
      style={{ background: "#2B373B" }}
      buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
      declineButtonStyle={{ color: "#fff", fontSize: "13px" }}
      expires={150} // Cookie expires after 150 days
    >
      This website uses cookies to enhance the user experience. By continuing to browse, you agree to our use of cookies.{" "}
      <a href="/cookie-policy" style={{ color: "#fff" }}>
        Learn more
      </a>
    </CookieConsent>
  );
}