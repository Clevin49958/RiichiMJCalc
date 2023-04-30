import { Navbar, Container, Nav } from "react-bootstrap";
import React from "react";
import Image from "next/image";
import logo from "../../../public/logo-32x32.ico";

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
            <Nav.Link href="/">New Game</Nav.Link>
            <Nav.Link href="/games">Past Games</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
