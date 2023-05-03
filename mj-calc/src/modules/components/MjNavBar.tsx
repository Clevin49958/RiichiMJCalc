import { Navbar, Container, Nav } from "react-bootstrap";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/logo-32x32.ico";
import LocaleSwitcher from "./LocaleSwitcher";

export default function MjNavBar() {
  return (
    <Navbar bg="light">
      <Container>
        <Navbar.Brand href="/">
          <Image alt="icon" src={logo} width={64} height={64} />
          Richii Mahjong Scorer
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Link className="navbar-expand navbar-nav nav-link" href="/">
              New Game
            </Link>
            <Link className="navbar-expand navbar-nav nav-link" href="/games">
              Past Games
            </Link>
            <LocaleSwitcher />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
