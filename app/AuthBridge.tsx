"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

function safeNextPath(){const value=new URLSearchParams(window.location.search).get("next")||"/";return value.startsWith("/")&&!value.startsWith("//")?value:"/"}

export default function AuthBridge(){
 const pathname=usePathname(); const router=useRouter();
 useEffect(()=>{if(pathname!=="/login")return;
  const form=document.querySelector('form[aria-label="Kazi za Kenya login form"]') as HTMLFormElement|null;
  const emailInput=form?.querySelector('input[aria-label="Email or phone number"]') as HTMLInputElement|null;
  const passwordInput=form?.querySelector('input[aria-label="Password"]') as HTMLInputElement|null;
  const rememberInput=form?.querySelector('label.remember input[type="checkbox"]') as HTMLInputElement|null;
  if(form){form.autocomplete="on"} if(emailInput){emailInput.name="username";emailInput.autocomplete="username"} if(passwordInput){passwordInput.name="password";passwordInput.autocomplete="current-password"}
  const remembered=window.localStorage.getItem("kzk-remembered-email"); if(remembered&&emailInput&&!emailInput.value)emailInput.value=remembered;

  async function handleSubmit(event:Event){const target=event.target as HTMLFormElement|null;if(!target||target.getAttribute("aria-label")!=="Kazi za Kenya login form")return;event.preventDefault();event.stopPropagation();const identifier=emailInput?.value.trim()??"",password=passwordInput?.value??"";if(!identifier||!password){window.alert("Please enter your email and password.");return}if(!identifier.includes("@")){window.alert("For now, please log in with your email address. Phone login will be added later.");return}const{error}=await supabase.auth.signInWithPassword({email:identifier,password});if(error){window.alert("We could not log you in. Check your email and password, or confirm your email if you just registered.");return}if(rememberInput?.checked)window.localStorage.setItem("kzk-remembered-email",identifier);else window.localStorage.removeItem("kzk-remembered-email");router.push(safeNextPath());router.refresh()}
  function handleClick(event:MouseEvent){const button=(event.target as HTMLElement|null)?.closest("button") as HTMLButtonElement|null;if(!button)return;if(button.classList.contains("create")){event.preventDefault();event.stopPropagation();const next=safeNextPath();router.push(next==="/"?"/signup":`/signup?next=${encodeURIComponent(next)}`)}else if(button.classList.contains("forgot")){event.preventDefault();event.stopPropagation();router.push("/forgot-password")}}
  document.addEventListener("submit",handleSubmit,true);document.addEventListener("click",handleClick,true);return()=>{document.removeEventListener("submit",handleSubmit,true);document.removeEventListener("click",handleClick,true)}
 },[pathname,router]);return null;
}
