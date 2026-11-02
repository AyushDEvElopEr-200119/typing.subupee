"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useUI } from "@/lib/ui-store";
import { Sheet } from "@/components/ui/Sheet";
import { Pressable } from "@/components/ui/Pressable";

type Flags = { google: boolean; microsoft: boolean };

export function AuthSheet({ onAuthed }: { onAuthed: (userId: string) => Promise<void> }) {
  const open = useUI((state) => state.authOpen);
  const mode = useUI((state) => state.authMode);
  const openAuth = useUI((state) => state.openAuth);
  const close = useUI((state) => state.closeAuth);
  const [flags, setFlags] = useState<Flags>({ google: false, microsoft: false });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [age, setAge] = useState(false);
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!open) return;
    void fetch("/api/providers")
      .then((response) => response.json())
      .then((body: Flags) => setFlags(body))
      .catch(() => undefined);
  }, [open]);

  const emailInvalid = touched && !email.includes("@");
  const passwordInvalid = touched && password.length < 8;
  const nameInvalid = touched && mode === "signup" && name.trim().length < 2;

  async function social(provider: "google" | "microsoft", ready: boolean) {
    setNotice("");
    if (!ready) {
      setNotice(`${provider === "google" ? "Google" : "Microsoft"} sign-in turns on when that provider's credentials are set on the server.`);
      return;
    }
    await authClient.signIn.social({ provider, callbackURL: "/learn" });
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setTouched(true);
    setError("");
    if (!email.includes("@") || password.length < 8 || (mode === "signup" && (name.trim().length < 2 || !age))) return;
    setPending(true);
    const result =
      mode === "signup"
        ? await authClient.signUp.email({ email, password, name: name.trim() })
        : await authClient.signIn.email({ email, password });
    setPending(false);
    if (result.error) {
      setError(result.error.message || "That didn't work. Check the details and try again.");
      return;
    }
    const session = await authClient.getSession();
    const userId = session.data?.user.id;
    if (userId) await onAuthed(userId);
    close();
  }

  return (
    <Sheet open={open} onClose={close} title={mode === "signup" ? "Create an account" : "Log in"} modal placement="center">
      <div className="auth-grid">
        <Pressable tone="quiet" onClick={() => social("google", flags.google)}>
          Google
        </Pressable>
        <Pressable tone="quiet" onClick={() => social("microsoft", flags.microsoft)}>
          Microsoft
        </Pressable>
        <Pressable tone="quiet" disabled title="Available when your school connects Subupee">
          Clever
        </Pressable>
        <Pressable tone="quiet" disabled title="Available when your school connects Subupee">
          ClassLink
        </Pressable>
      </div>
      {notice && <p className="field-error">{notice}</p>}
      <div className="or">or</div>
      <form onSubmit={submit}>
        {mode === "signup" && (
          <label className="field">
            <span>Name</span>
            <input value={name} onChange={(event) => setName(event.target.value)} onBlur={() => setTouched(true)} autoComplete="name" />
            {nameInvalid && <p className="field-error">Use at least two letters.</p>}
          </label>
        )}
        <label className="field">
          <span>Email</span>
          <input value={email} onChange={(event) => setEmail(event.target.value)} onBlur={() => setTouched(true)} autoComplete="email" inputMode="email" />
          {emailInvalid && <p className="field-error">Enter an email address.</p>}
        </label>
        <label className="field">
          <span>Password</span>
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            onBlur={() => setTouched(true)}
            type={show ? "text" : "password"}
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
          />
          <button type="button" className="pressable btn btn-plain btn-small" onClick={() => setShow((value) => !value)}>
            {show ? "Hide" : "Show"}
          </button>
          {passwordInvalid && <p className="field-error">Use at least 8 characters.</p>}
        </label>
        {mode === "signup" && (
          <label className="check">
            <input type="checkbox" checked={age} onChange={(event) => setAge(event.target.checked)} />
            <span>I am 13 or older, or an adult is creating this account for me.</span>
          </label>
        )}
        {touched && mode === "signup" && !age && <p className="field-error">Confirm your age to create an account.</p>}
        {error && <p className="field-error">{error}</p>}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.9rem" }}>
          <button type="button" className="pressable btn btn-plain" onClick={() => openAuth(mode === "signup" ? "login" : "signup")}>
            {mode === "signup" ? "Log in" : "Create an account"}
          </button>
          <Pressable tone="primary" type="submit" disabled={pending}>
            {pending ? "Working" : mode === "signup" ? "Sign up" : "Log in"}
          </Pressable>
        </div>
      </form>
    </Sheet>
  );
}
