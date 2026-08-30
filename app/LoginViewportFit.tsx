"use client";

export default function LoginViewportFit() {
  return (
    <style jsx global>{`
      @media (min-width: 901px) {
        .adwPage { height: 100svh !important; min-height: 640px !important; overflow: hidden !important; }
        .adwHero, .adwLoginSide { height: 100svh !important; min-height: 640px !important; }

        .adwHeroContent {
          padding: clamp(24px,3vh,38px) 0 clamp(120px,15vh,150px) 3.35vw !important;
          max-width: 900px !important;
        }
        .adwBrand {
          font-size: clamp(38px,3.65vw,60px) !important;
          font-weight: 820 !important;
          letter-spacing: -.042em !important;
        }
        .adwTagline {
          margin-top: .5rem !important;
          font-size: clamp(15px,1.25vw,21px) !important;
          line-height: 1.35 !important;
        }
        .adwPitch { margin-top: clamp(28px,4.5vh,48px) !important; }
        .adwPitch h1 {
          font-size: clamp(46px,4.35vw,70px) !important;
          line-height: 1.01 !important;
          letter-spacing: -.038em !important;
          font-weight: 790 !important;
        }
        .adwCopy {
          font-size: clamp(18px,1.42vw,23px) !important;
          line-height: 1.48 !important;
          margin-top: 1.15rem !important;
          font-weight: 430 !important;
        }
        .adwSimple {
          font-size: clamp(18px,1.3vw,22px) !important;
          margin-top: .5rem !important;
        }
        .adwBenefits {
          gap: 1.15rem !important;
          margin-top: 1.75rem !important;
        }
        .adwBenefit { gap: .9rem !important; }
        .adwBenefitIcon {
          width: 52px !important;
          height: 52px !important;
          font-size: 25px !important;
          box-shadow: 0 6px 18px rgba(0,0,0,.1) !important;
        }
        .adwBenefitIcon.pin:before { width: 20px !important; height: 26px !important; }
        .adwBenefit b { font-size: clamp(16px,1.16vw,20px) !important; }
        .adwBenefit span { font-size: clamp(13px,.98vw,16px) !important; line-height: 1.4 !important; }

        .adwBottom {
          height: clamp(108px,13.5vh,136px) !important;
          padding: 18px 0 0 !important;
          gap: 1rem !important;
          align-items: center !important;
          justify-content: center !important;
          clip-path: none !important;
          overflow: visible !important;
          background: #0b0d0c !important;
        }
        .adwBottom::before {
          content: "";
          position: absolute;
          left: -6%;
          right: -6%;
          top: -34px;
          height: 64px;
          background: #0b0d0c;
          border-radius: 50% 50% 0 0 / 100% 100% 0 0;
          z-index: -1;
        }
        .adwBottom > * { position: relative; z-index: 1; }
        .adwBottom b { font-size: 17px !important; line-height: 1.2 !important; }
        .adwBottom span { font-size: 14px !important; line-height: 1.4 !important; margin-top: .35rem !important; }
        .adwEveryoneIcon { font-size: 42px !important; line-height: 1 !important; }

        .adwLoginSide { padding: clamp(14px,2vh,24px) 1.7vw !important; }
        .adwCard {
          width: min(100%,510px) !important;
          border-radius: 22px !important;
          padding: clamp(24px,2.8vh,36px) clamp(27px,2.25vw,40px) !important;
        }
        .adwCardHeader h2 {
          font-size: clamp(32px,2.55vw,41px) !important;
          line-height: 1.06 !important;
          letter-spacing: -.025em !important;
          font-weight: 780 !important;
        }
        .adwTricolor { margin-top: .75rem !important; width: 70% !important; }
        .adwCardHeader p {
          margin: .8rem 0 1.45rem !important;
          font-size: clamp(15px,1.05vw,17px) !important;
          line-height: 1.35 !important;
        }
        .adwForm { gap: .82rem !important; }
        .adwField {
          height: clamp(54px,6.6vh,61px) !important;
          border-radius: 11px !important;
          padding-left: 1rem !important;
          padding-right: .8rem !important;
        }
        .adwField input { font-size: 16px !important; }
        .fieldIcon { font-size: 20px !important; width: 28px !important; }
        .eyeButton { font-size: 14px !important; }
        .adwOptions { margin: .15rem 0 !important; font-size: 15px !important; }
        .adwRemember input { width: 18px !important; height: 18px !important; }
        .adwLoginButton {
          height: clamp(52px,6.3vh,59px) !important;
          font-size: 20px !important;
          margin-top: .15rem !important;
          font-weight: 720 !important;
        }

        .adwDivider,
        .adwSocials { display: none !important; }

        .adwSignup {
          margin: .8rem 0 0 !important;
          padding-top: .85rem !important;
          border-top: 1px solid #e2e5e8 !important;
          font-size: 16px !important;
          line-height: 1.35 !important;
        }
        .adwSignup button { font-size: inherit !important; }
      }

      @media (min-width: 901px) and (max-height: 720px) {
        .adwHeroContent {
          padding-top: 22px !important;
          padding-bottom: 122px !important;
        }
        .adwBrand { font-size: clamp(36px,3.3vw,52px) !important; }
        .adwTagline { font-size: 15px !important; }
        .adwPitch { margin-top: 24px !important; }
        .adwPitch h1 {
          font-size: clamp(42px,4vw,60px) !important;
          line-height: 1.01 !important;
        }
        .adwCopy {
          font-size: 17px !important;
          line-height: 1.45 !important;
          margin-top: .9rem !important;
        }
        .adwSimple { font-size: 17px !important; margin-top: .42rem !important; }
        .adwBenefits {
          margin-top: 1.25rem !important;
          gap: .8rem !important;
        }
        .adwBenefitIcon { width: 46px !important; height: 46px !important; }
        .adwBenefit b { font-size: 16px !important; }
        .adwBenefit span { font-size: 13.5px !important; }
        .adwBottom {
          height: 104px !important;
          padding-top: 20px !important;
        }
        .adwBottom::before { top: -28px !important; height: 54px !important; }
        .adwBottom b { font-size: 16px !important; }
        .adwBottom span { font-size: 13px !important; }

        .adwCard { padding: 20px 32px !important; }
        .adwCardHeader h2 { font-size: 31px !important; }
        .adwCardHeader p { margin: .55rem 0 .95rem !important; font-size: 14px !important; }
        .adwForm { gap: .58rem !important; }
        .adwField { height: 52px !important; }
        .adwField input { font-size: 15px !important; }
        .adwOptions { font-size: 14px !important; }
        .adwLoginButton { height: 50px !important; font-size: 18px !important; }
        .adwSignup { margin-top: .55rem !important; padding-top: .65rem !important; font-size: 15px !important; }
      }
    `}</style>
  );
}
