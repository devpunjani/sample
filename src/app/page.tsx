"use client";

import { UserProvider } from "@auth0/nextjs-auth0/client";
import ChatInterface from "./components/ChatInterface";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Home() {
  return (
    <UserProvider>
      <main>
        <ChatInterface />
      </main>
    </UserProvider>
  );
}
