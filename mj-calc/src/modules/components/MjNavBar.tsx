import { Navbar, Container, Nav } from "react-bootstrap";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import logo from "../../../public/logo-32x32.ico";
import LocaleSwitcher from "./LocaleSwitcher";

export default function MjNavBar() {
  const { t } = useTranslation("common");
  return (
    <Navbar bg="light">
      <Container>
        <Navbar.Brand>
          <Link className="nav-link" href="/">
            <Image alt="icon" src={logo} width={64} height={64} />
            {t("brand.full")}
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Link className="navbar-expand navbar-nav nav-link" href="/">
              {t("game.new")}
            </Link>
            <Link className="navbar-expand navbar-nav nav-link" href="/games">
              {t("game.history")}
            </Link>
            <LocaleSwitcher />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
