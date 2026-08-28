export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="loginSkylineOverlay" aria-hidden="true">
        <svg viewBox="0 0 1600 430" preserveAspectRatio="none" role="presentation">
          <g fill="#9aa0a6">
            <rect x="0" y="298" width="78" height="132"/>
            <rect x="86" y="270" width="74" height="160"/>
            <rect x="170" y="310" width="68" height="120"/>
            <rect x="250" y="247" width="82" height="183"/>
            <rect x="342" y="292" width="66" height="138"/>
            <rect x="422" y="225" width="92" height="205"/>
            <rect x="526" y="315" width="75" height="115"/>
            <rect x="618" y="258" width="80" height="172"/>
            <rect x="710" y="300" width="88" height="130"/>
            <rect x="814" y="238" width="86" height="192"/>
            <rect x="914" y="284" width="78" height="146"/>
            <rect x="1008" y="218" width="88" height="212"/>
            <rect x="1110" y="292" width="76" height="138"/>
            <rect x="1200" y="248" width="86" height="182"/>
            <rect x="1300" y="306" width="72" height="124"/>
            <rect x="1386" y="268" width="82" height="162"/>
            <rect x="1480" y="318" width="120" height="112"/>
          </g>

          <g fill="#8c9399">
            <rect x="105" y="178" width="88" height="252" rx="8"/>
            <ellipse cx="149" cy="180" rx="58" ry="17"/>
            <rect x="127" y="146" width="44" height="35"/>
            <ellipse cx="149" cy="146" rx="34" ry="9"/>
            <rect x="146" y="119" width="6" height="28"/>
            <rect x="1080" y="143" width="54" height="287"/>
            <polygon points="1107,105 1134,143 1080,143"/>
            <rect x="1103" y="73" width="8" height="34"/>
          </g>

          <g fill="#c7cbcf" opacity="0.85">
            <rect x="92" y="214" width="114" height="7"/>
            <rect x="92" y="238" width="114" height="7"/>
            <rect x="92" y="262" width="114" height="7"/>
            <rect x="92" y="286" width="114" height="7"/>
            <rect x="92" y="310" width="114" height="7"/>
            <rect x="92" y="334" width="114" height="7"/>
            <rect x="92" y="358" width="114" height="7"/>
            <rect x="92" y="382" width="114" height="7"/>
            <rect x="1069" y="192" width="76" height="6"/>
            <rect x="1069" y="222" width="76" height="6"/>
            <rect x="1069" y="252" width="76" height="6"/>
            <rect x="1069" y="282" width="76" height="6"/>
            <rect x="1069" y="312" width="76" height="6"/>
            <rect x="1069" y="342" width="76" height="6"/>
            <rect x="1069" y="372" width="76" height="6"/>
          </g>

          <path d="M0 389 C140 359 275 373 410 390 C580 411 745 377 900 393 C1080 412 1270 370 1600 392 L1600 430 L0 430 Z" fill="#b9bec3"/>
        </svg>
      </div>
      {children}
      <style>{`
        .loginSkylineOverlay{
          position:fixed;
          left:0;
          right:0;
          bottom:74px;
          height:48vh;
          min-height:300px;
          max-height:430px;
          z-index:2;
          pointer-events:none;
          opacity:.34;
          overflow:hidden;
        }
        .loginSkylineOverlay svg{width:100%;height:100%;display:block}
        @media(max-width:699px){.loginSkylineOverlay{display:none}}
      `}</style>
    </>
  );
}
