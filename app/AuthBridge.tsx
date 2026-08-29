"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

function safeNextPath(){const value=new URLSearchParams(window.location.search).get("next")||"/";return value.startsWith("/")&&!value.startsWith("//")?value:"/"}

export default function AuthBridge(){
 const pathname=usePathname(); const router=useRouter();

 useEffect(()=>{
  if(pathname!=="/")return;
  let cancelled=false;
  let renderVersion=0;

  function findTopbarActions(){return document.querySelector(".topbar .actions") as HTMLElement|null}
  function findLoginButton(){const actions=findTopbarActions();if(!actions)return null;return Array.from(actions.querySelectorAll("button")).find(button=>(button.textContent||"").trim().toLowerCase()==="log in") as HTMLButtonElement|undefined}
  function removeSignedInControls(){document.querySelectorAll('[data-kzk-account-button="true"],[data-kzk-logout-button="true"]').forEach(element=>element.remove())}
  async function getUnreadCount(){const {data,error}=await supabase.rpc("get_unread_message_count");return error?0:Number(data)||0}
  async function refreshUnreadLabel(){const account=document.querySelector('[data-kzk-account-button="true"]') as HTMLButtonElement|null;if(!account)return;const unread=await getUnreadCount();if(cancelled)return;account.textContent=unread>0?`My account (${unread})`:"My account";account.title=unread>0?`${unread} unread message${unread===1?"":"s"}`:"My account"}

  async function renderAuthControls(){
   const version=++renderVersion;
   const {data:{user}}=await supabase.auth.getUser();
   if(cancelled||version!==renderVersion)return;
   const actions=findTopbarActions(); const login=findLoginButton();
   if(!actions)return;
   removeSignedInControls();
   if(!user){if(login)login.style.display="";return}
   if(login)login.style.display="none";

   const unread=await getUnreadCount();
   if(cancelled||version!==renderVersion)return;
   removeSignedInControls();
   const account=document.createElement("button");
   account.type="button"; account.className="btn"; account.dataset.kzkAccountButton="true"; account.textContent=unread>0?`My account (${unread})`:"My account"; account.title=unread>0?`${unread} unread message${unread===1?"":"s"}`:"My account";
   account.addEventListener("click",()=>router.push("/account"));

   const logout=document.createElement("button");
   logout.type="button"; logout.className="btn"; logout.dataset.kzkLogoutButton="true"; logout.textContent="Log out";
   logout.style.cssText="border-color:#d7b3b3;color:#8f2424;background:#fff;";
   logout.addEventListener("click",async()=>{logout.disabled=true;logout.textContent="Logging out…";await supabase.auth.signOut();router.replace("/");router.refresh()});

   actions.appendChild(account); actions.appendChild(logout);
  }

  const timer=window.setTimeout(()=>void renderAuthControls(),0);
  const {data:{subscription}}=supabase.auth.onAuthStateChange(()=>{window.setTimeout(()=>void renderAuthControls(),0)});
  const channel=supabase.channel("marketplace-unread-live").on("postgres_changes",{event:"INSERT",schema:"public",table:"messages"},()=>{void refreshUnreadLabel()}).subscribe();
  const onFocus=()=>{void refreshUnreadLabel()}; window.addEventListener("focus",onFocus);
  const onVisibility=()=>{if(document.visibilityState==="visible")void refreshUnreadLabel()}; document.addEventListener("visibilitychange",onVisibility);
  return()=>{cancelled=true;renderVersion++;window.clearTimeout(timer);subscription.unsubscribe();supabase.removeChannel(channel);window.removeEventListener("focus",onFocus);document.removeEventListener("visibilitychange",onVisibility);removeSignedInControls();const login=findLoginButton();if(login)login.style.display=""}
 },[pathname,router]);

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
