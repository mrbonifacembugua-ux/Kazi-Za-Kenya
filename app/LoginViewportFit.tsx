"use client";

export default function LoginViewportFit() {
  return (
    <style jsx global>{`
      @media (min-width: 901px) {
        .adwPage { height: 100svh !important; min-height: 640px !important; overflow: hidden !important; }
        .adwHero, .adwLoginSide { height: 100svh !important; min-height: 640px !important; }
        .adwHeroContent { padding: clamp(20px,2.6vh,34px) 0 clamp(110px,14vh,145px) 3.2vw !important; }
        .adwBrand { font-size: clamp(34px,3.45vw,56px) !important; }
        .adwTagline { margin-top: .35rem !important; font-size: clamp(14px,1.2vw,20px) !important; }
        .adwPitch { margin-top: clamp(22px,4vh,42px) !important; }
        .adwPitch h1 { font-size: clamp(42px,4.35vw,70px) !important; line-height: .95 !important; }
        .adwCopy { font-size: clamp(16px,1.35vw,22px) !important; line-height: 1.35 !important; margin-top: 1rem !important; }
        .adwSimple { font-size: clamp(16px,1.25vw,21px) !important; margin-top: .35rem !important; }
        .adwBenefits { gap: .8rem !important; margin-top: 1.25rem !important; }
        .adwBenefit { gap: .75rem !important; }
        .adwBenefitIcon { width: 48px !important; height: 48px !important; font-size: 24px !important; }
        .adwBenefitIcon.pin:before { width: 19px !important; height: 25px !important; }
        .adwBenefit b { font-size: clamp(15px,1.1vw,19px) !important; }
        .adwBenefit span { font-size: clamp(12px,.9vw,15px) !important; }
        .adwBottom { height: clamp(100px,13vh,130px) !important; }
        .adwBottom b { font-size: 15px !important; }
        .adwBottom span { font-size: 13px !important; }
        .adwEveryoneIcon { font-size: 38px !important; }
        .adwLoginSide { padding: clamp(14px,2vh,24px) 1.7vw !important; }
        .adwCard { width: min(100%,500px) !important; border-radius: 22px !important; padding: clamp(22px,2.6vh,34px) clamp(24px,2.2vw,38px) !important; }
        .adwCardHeader h2 { font-size: clamp(30px,2.5vw,40px) !important; }
        .adwTricolor { margin-top: .7rem !important; }
        .adwCardHeader p { margin: .7rem 0 1.35rem !important; font-size: clamp(14px,1vw,16px) !important; }
        .adwForm { gap: .7rem !important; }
        .adwField { height: clamp(52px,6.5vh,60px) !important; }
        .adwField input { font-size: 15px !important; }
        .fieldIcon { font-size: 20px !important; }
        .adwOptions { margin: .1rem 0 !important; font-size: 14px !important; }
        .adwRemember input { width: 17px !important; height: 17px !important; }
        .adwLoginButton { height: clamp(50px,6.2vh,58px) !important; font-size: 19px !important; margin-top: .1rem !important; }
        .adwDivider { margin: .35rem 0 !important; }
        .adwDivider span { font-size: 13px !important; }
        .adwSocials { gap: 1.4rem !important; }
        .adwSocials button { width: clamp(48px,5.8vh,56px) !important; height: clamp(48px,5.8vh,56px) !important; font-size: 21px !important; }
        .adwSignup { margin-top: .65rem !important; font-size: 15px !important; }
      }

      @media (min-width: 901px) and (max-height: 720px) {
        .adwPitch { margin-top: 18px !important; }
        .adwBenefits { margin-top: .8rem !important; gap: .55rem !important; }
        .adwBottom { height: 92px !important; }
        .adwCard { padding-top: 18px !important; padding-bottom: 18px !important; }
        .adwCardHeader p { margin-bottom: .9rem !important; }
        .adwSocials button { width: 44px !important; height: 44px !important; }
      }
    `}</style>
  );
}
