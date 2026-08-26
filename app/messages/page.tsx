"use client";

import { FormEvent, useEffect, useState } from "react";

export default function MessagesPage() {
  const [person, setPerson] = useState("Kazi za Kenya user");
  const [messages, setMessages] = useState<string[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const selected = params.get("with") || "Kazi za Kenya user";
    setPerson(selected);
    const saved = localStorage.getItem(`kazi-chat-${selected}`);
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  const send = (e: FormEvent) => {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    const next = [...messages, value];
    setMessages(next);
    localStorage.setItem(`kazi-chat-${person}`, JSON.stringify(next));
    setText("");
  };

  return (
    <main className="page">
      <header><a href="/">Kazi <span>za</span> <b>Kenya</b></a><a className="back" href="/">← Back to map</a></header>
      <section className="chat">
        <div className="chatHead"><div className="avatar">👤</div><div><h1>{person}</h1><p>Message safely through Kazi za Kenya</p></div></div>
        <div className="messages">
          {messages.length === 0 ? <div className="empty"><b>Start the conversation</b><span>Ask about the job, price, location or availability.</span></div> : messages.map((m,i)=><div className="bubble" key={`${m}-${i}`}>{m}</div>)}
        </div>
        <form onSubmit={send}><input value={text} onChange={e=>setText(e.target.value)} placeholder="Write a message..."/><button>Send</button></form>
      </section>
      <p className="note">Messages are saved on this device for now; the account-to-account backend can be connected next.</p>
      <style jsx>{`*{box-sizing:border-box}.page{min-height:100vh;background:#f7faf7;color:#172019;font-family:Inter,system-ui,sans-serif;padding:0 18px}header{height:54px;background:#fff;border-top:4px solid #111;border-bottom:1px solid #dfe6df;display:flex;align-items:center;justify-content:space-between;padding:0 14px}header a{color:#111;text-decoration:none;font-weight:900}header span{color:#c90000}header b{color:#08763e}.back{font-size:12px;color:#08763e}.chat{width:min(720px,100%);height:calc(100vh - 120px);margin:22px auto 0;background:#fff;border:1px solid #dce3dd;border-radius:14px;box-shadow:0 12px 35px #0001;display:flex;flex-direction:column;overflow:hidden}.chatHead{display:flex;gap:12px;align-items:center;padding:16px;border-bottom:1px solid #e1e7e2}.chatHead h1{font-size:18px;margin:0}.chatHead p{font-size:10px;color:#68716b;margin:3px 0}.avatar{width:44px;height:44px;border-radius:50%;background:#e7f1e9;display:grid;place-items:center}.messages{flex:1;padding:18px;overflow:auto;display:flex;flex-direction:column;gap:8px}.empty{margin:auto;text-align:center;color:#68716b;display:flex;flex-direction:column;gap:5px;font-size:11px}.bubble{align-self:flex-end;max-width:75%;background:#08763e;color:#fff;padding:10px 13px;border-radius:13px 13px 3px 13px;font-size:12px}.chat form{display:flex;gap:8px;padding:12px;border-top:1px solid #e1e7e2}.chat input{flex:1;border:1px solid #cfd8d0;border-radius:8px;padding:11px;font-size:12px}.chat button{border:0;background:#c90000;color:#fff;border-radius:8px;padding:0 18px;font-weight:900}.note{text-align:center;color:#78817a;font-size:9px;margin:10px auto;max-width:720px}`}</style>
    </main>
  );
}
