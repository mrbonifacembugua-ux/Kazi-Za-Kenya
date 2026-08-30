"use client";

export default function LoginViewportFit() {
  return (
    <style jsx global>{`
      @media (min-width: 901px) {
        .adwPage { height: 100svh !important; min-height: 640px !important; overflow: hidden !important; }
        .adwHero, .adwLoginSide { height: 100svh !important; min-height: 640px !important; }

        .adwHeroContent {
          padding: clamp(20px,2.6vh,34px) 0 clamp(108px,13vh,138px) 3.2vw !important;
          max-width: 860px !important;
        }
        .adwBrand {
          font-size: clamp(36px,3.55vw,58px) !important;
          font-weight: 820 !important;
          letter-spacing: -.042em !important;
        }
        .adwTagline {
          margin-top: .4rem !important;
          font-size: clamp(15px,1.22vw,20px) !important;
          line-height: 1.3 !important;
        }
        .adwPitch { margin-top: clamp(22px,3.8vh,40px) !important; }
        .adwPitch h1 {
          font-size: clamp(44px,4.25vw,68px) !important;
          line-height: 1 !important;
          letter-spacing: -.038em !important;
          font-weight: 790 !important;
        }
        .adwCopy {
          font-size: clamp(17px,1.38vw,22px) !important;
          line-height: 1.42 !important;
          margin-top: 1.05rem !important;
          font-weight: 430 !important;
        }
        .adwSimple {
          font-size: clamp(17px,1.28vw,21px) !important;
          margin-top: .42rem !important;
        }
        .adwBenefits { gap: .9rem !important; margin-top: 1.35rem !important; }
        .adwBenefit { gap: .82rem !important; }
        .adwBenefitIcon {
          width: 50px !important;
          height: 50px !important;
          font-size: 24px !important;
          box-shadow: 0 6px 18px rgba(0,0,0,.1) !important;
        }
        .adwBenefitIcon.pin:before { width: 19px !important; height: 25px !important; }
        .adwBenefit b { font-size: clamp(16px,1.12vw,19px) !important; }
        .adwBenefit span { font-size: clamp(13px,.94vw,16px) !important; line-height: 1.35 !important; }

        .adwBottom {
          height: clamp(102px,13vh,132px) !important;
          padding-left: 22% !important;
          gap: .85rem !important;
          align-items: center !important;
        }
        .adwBottom b { font-size: 16px !important; line-height: 1.2 !important; }
        .adwBottom span { font-size: 14px !important; line-height: 1.35 !important; margin-top: .3rem !important; }
        .adwEveryoneIcon { font-size: 40px !important; line-height: 1 !important; }

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
        .adwHeroContent { padding-top: 16px !important; padding-bottom: 96px !important; }
        .adwBrand { font-size: clamp(34px,3.2vw,50px) !important; }
        .adwTagline { font-size: 14px !important; }
        .adwPitch { margin-top: 16px !important; }
        .adwPitch h1 { font-size: clamp(40px,3.9vw,60px) !important; }
        .adwCopy { font-size: 16px !important; margin-top: .75rem !important; }
        .adwSimple { font-size: 16px !important; }
        .adwBenefits { margin-top: .75rem !important; gap: .5rem !important; }
        .adwBenefitIcon { width: 44px !important; height: 44px !important; }
        .adwBenefit b { font-size: 15px !important; }
        .adwBenefit span { font-size: 13px !important; }
        .adwBottom { height: 94px !important; }
        .adwBottom b { font-size: 15px !important; }
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
