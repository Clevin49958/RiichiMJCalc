import { NavDropdown } from "react-bootstrap";
import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "next-i18next";

export default function LocaleSwitcher() {
  const router = useRouter();
  const { locales, locale: activeLocale } = router;
  const { t } = useTranslation("common");

  const otherLocales = (locales || []).filter(
    (locale) => locale !== activeLocale
  );

  return (
    <NavDropdown
      title={
        <>
          <FontAwesomeIcon icon={faGlobe} /> {t(`lang.${activeLocale}`)}
        </>
      }
    >
      {otherLocales.map((locale) => {
        const { pathname, query, asPath } = router;
        return (
          <NavDropdown.Item key={locale}>
            <Link
              href={{ pathname, query }}
              as={asPath}
              locale={locale}
              legacyBehavior
            >
              {t(`lang.${locale}`)}
            </Link>
          </NavDropdown.Item>
        );
      })}
    </NavDropdown>
  );
}
