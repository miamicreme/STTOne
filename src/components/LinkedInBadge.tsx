// src/components/LinkedInBadge.tsx
// Official LinkedIn profile badge for Kohron Burton.
// Loads LinkedIn's script on mount and renders the badge. If the script is
// blocked (ad blockers, strict CSP, offline), the plain link inside shows
// instead — so it always degrades gracefully.

import { useEffect } from "react";

type Props = {
  size?: "small" | "medium" | "large";
  theme?: "light" | "dark";
  type?: "VERTICAL" | "HORIZONTAL";
};

export default function LinkedInBadge({
  size = "medium",
  theme = "light",
  type = "VERTICAL",
}: Props) {
  useEffect(() => {
    // Re-inject on mount so the badge renders even when this view is
    // mounted after initial page load (LinkedIn's script scans on run).
    const s = document.createElement("script");
    s.src = "https://platform.linkedin.com/badges/js/profile.js";
    s.async = true;
    s.defer = true;
    document.body.appendChild(s);
    return () => {
      try {
        document.body.removeChild(s);
      } catch {
        /* already gone */
      }
    };
  }, []);

  return (
    <div
      className="badge-base LI-profile-badge"
      data-locale="en_US"
      data-size={size}
      data-theme={theme}
      data-type={type}
      data-vanity="kohronburton"
      data-version="v1"
    >
      <a
        className="badge-base__link LI-simple-link"
        href="https://www.linkedin.com/in/kohronburton?trk=profile-badge"
      >
        Kohron Burton
      </a>
    </div>
  );
}
