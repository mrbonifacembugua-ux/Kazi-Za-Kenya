"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const COUNTRY_AREAS: Record<string,string> = {
  KE:"Nairobi, Kenya", UG:"Kampala, Uganda", TZ:"Dar es Salaam, Tanzania", RW:"Kigali, Rwanda", BI:"Bujumbura, Burundi",
  ET:"Addis Ababa, Ethiopia", SO:"Mogadishu, Somalia", DJ:"Djibouti, Djibouti", ER:"Asmara, Eritrea", SS:"Juba, South Sudan",
  SD:"Khartoum, Sudan", EG:"Cairo, Egypt", LY:"Tripoli, Libya", TN:"Tunis, Tunisia", DZ:"Algiers, Algeria", MA:"Casablanca, Morocco",
  MR:"Nouakchott, Mauritania", ML:"Bamako, Mali", NE:"Niamey, Niger", TD:"N'Djamena, Chad", NG:"Lagos, Nigeria",
  BJ:"Cotonou, Benin", BF:"Ouagadougou, Burkina Faso", CI:"Abidjan, Côte d’Ivoire", GH:"Accra, Ghana", GN:"Conakry, Guinea",
  GW:"Bissau, Guinea-Bissau", LR:"Monrovia, Liberia", SN:"Dakar, Senegal", SL:"Freetown, Sierra Leone", GM:"Banjul, Gambia",
  ZA:"Johannesburg, South Africa", ZM:"Lusaka, Zambia", ZW:"Harare, Zimbabwe", BW:"Gaborone, Botswana", NA:"Windhoek, Namibia",
  MZ:"Maputo, Mozambique", MW:"Lilongwe, Malawi", LS:"Maseru, Lesotho", SZ:"Mbabane, Eswatini", MG:"Antananarivo, Madagascar",
  MU:"Port Louis, Mauritius", SC:"Victoria, Seychelles", AO:"Luanda, Angola", CD:"Kinshasa, Democratic Republic of the Congo",
  CG:"Brazzaville, Republic of the Congo", CM:"Yaoundé, Cameroon", GA:"Libreville, Gabon", GQ:"Malabo, Equatorial Guinea", CF:"Bangui, Central African Republic",
  GB:"London, United Kingdom", IE:"Dublin, Ireland", FR:"Paris, France", DE:"Berlin, Germany", IT:"Rome, Italy", ES:"Madrid, Spain",
  PT:"Lisbon, Portugal", NL:"Amsterdam, Netherlands", BE:"Brussels, Belgium", CH:"Zurich, Switzerland", AT:"Vienna, Austria",
  PL:"Warsaw, Poland", CZ:"Prague, Czechia", SK:"Bratislava, Slovakia", HU:"Budapest, Hungary", RO:"Bucharest, Romania",
  BG:"Sofia, Bulgaria", RS:"Belgrade, Serbia", HR:"Zagreb, Croatia", SI:"Ljubljana, Slovenia", BA:"Sarajevo, Bosnia and Herzegovina",
  ME:"Podgorica, Montenegro", MK:"Skopje, North Macedonia", AL:"Tirana, Albania", XK:"Pristina, Kosovo", GR:"Athens, Greece"
};

function normalize(value: unknown){const code=String(value||"").trim().toUpperCase();return /^[A-Z]{2}$/.test(code)?code:"";}
function fallbackArea(code:string){try{return new Intl.DisplayNames(["en"],{type:"region"}).of(code)||code;}catch{return code;}}

export default function MarketplaceCountrySearchSync(){
  const pathname=usePathname();
  useEffect(()=>{
    if(pathname!=="/") return;
    let timer=0;
    let attempts=0;

    const switchCountry=(code:string)=>{
      const area=COUNTRY_AREAS[code]||fallbackArea(code);
      const trySearch=()=>{
        const input=document.querySelector<HTMLInputElement>(".location-search-field input");
        const button=document.querySelector<HTMLButtonElement>(".area-search-button");
        if(!input||!button){
          attempts+=1;
          if(attempts<40) timer=window.setTimeout(trySearch,100);
          return;
        }
        attempts=0;
        const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,"value")?.set;
        setter?.call(input,area);
        input.dispatchEvent(new Event("input",{bubbles:true}));
        input.dispatchEvent(new Event("change",{bubbles:true}));
        timer=window.setTimeout(()=>{ if(!button.disabled) button.click(); },80);
      };
      trySearch();
    };

    const onCountry=(event:Event)=>{
      const code=normalize((event as CustomEvent<{countryCode?:string}>).detail?.countryCode);
      if(code) switchCountry(code);
    };
    window.addEventListener("anydaywork:country-changed",onCountry as EventListener);
    return()=>{window.clearTimeout(timer);window.removeEventListener("anydaywork:country-changed",onCountry as EventListener);};
  },[pathname]);
  return null;
}
