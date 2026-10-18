import Image from "next/image";
import { useServerTranslation } from "~/i18n";
import { Navbar } from "~/components/Navbar/Navbar";
import { Button } from "~/components/ui/button";
import { Poppins } from "next/font/google";
import heroImage from "~/assets/hero.png";
import showcase from "~/assets/showcase.png";
import showcaseMobile from "~/assets/showcaseMobile.png";
import Link from "next/link";
import { Footer } from "./molecules/Footer";
import { PricingSection } from "./molecules/PricingSection";

const poppins = Poppins({
  weight: ["300", "400", "700"],
  subsets: ["latin-ext"],
});

export const LandingPage = async () => {
  const { t } = await useServerTranslation();

  return (
    <>
      <Navbar />
      <div className="fixed -z-10 h-full w-screen opacity-20">
        <Image
          src="/images/landing-bg.jpeg"
          alt={t("landingPage.backgroundAlt")}
          fill
          sizes="100vw"
          style={{ objectFit: "cover" }}
        />
      </div>
      <main
        className={`${poppins.className} 
        flex min-h-screen flex-col items-center justify-start overflow-hidden pt-20 lg:gap-40 lg:px-4`}
      >
        <section className="container flex flex-col items-center justify-between p-0 lg:flex-row lg:gap-32">
          <div className="flex flex-1 flex-col items-center gap-12  lg:items-start">
            <h1 className="text-center text-5xl font-bold text-landing-text lg:text-left lg:text-6xl">
              {t("landingPage.section1.header")}{" "}
              <span className="bg-gradient-to-b from-landing-primary via-landing-primary to-landing-secondary bg-clip-text text-transparent">
                {t("landingPage.section1.headerHighlight")}
              </span>{" "}
              {t("landingPage.section1.headerSuffix")}
            </h1>
            <p className="text-landing-textfont-light w-3/4 text-center lg:w-full lg:text-left">
              {t("landingPage.section1.description")}
            </p>
            <div className="space-x-5">
              <Link href="/login">
                <Button className="bg-landing-primary">
                  {t("landingPage.section1.getStarted")}
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline">
                  {t("landingPage.section1.learnMore")}
                </Button>
              </Link>
            </div>
            <div className="flex flex-col flex-wrap gap-2 sm:flex-row">
              <a
                href="https://www.producthunt.com/posts/feastqr?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-feastqr"
                target="_blank"
                className="group flex w-fit items-center gap-3 rounded-xl bg-landing-text py-3 pl-4 pr-8 text-white hover:bg-black"
              >
                <span className="rounded-full bg-white px-3 py-1 text-center text-xl font-bold text-landing-text group-hover:text-black">
                  P
                </span>
                <div className="flex flex-col text-left">
                  <span className="text-xs uppercase">
                    {t("landingPage.section1.featuredOn")}
                  </span>
                  <span className="leading-tight">
                    {t("landingPage.section1.productHunt")}
                  </span>
                </div>
              </a>
              <a
                href="https://x.com/abdul_m_barrie?s=11"
                target="_blank"
                rel="noreferrer"
                className="group flex w-fit items-center gap-3 rounded-xl bg-landing-text py-3 pl-4 pr-8 text-white hover:bg-black transition-colors"
              >
                <span className="rounded-full bg-white px-3 py-1 text-center text-xl font-bold text-landing-text group-hover:text-black">
                  A
                </span>
                <div className="flex flex-col text-left">
                  <span className="text-xs uppercase">
                    {t("landingPage.section1.credit")}
                  </span>
                  <span className="leading-tight font-semibold">
                    Abdul Malik Barrie
                  </span>
                </div>
              </a>
              <a
                href="https://github.com/Bahri232"
                target="_blank"
                rel="noreferrer"
                className="group flex w-fit items-center gap-3 rounded-xl bg-landing-text py-3 pl-4 pr-6 text-white hover:bg-black transition-colors"
                aria-label="GitHub @Bahri232"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-landing-text group-hover:text-black">
                  <svg
                    className="h-4 w-4 fill-current"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    />
                  </svg>
                </span>
                <div className="flex flex-col text-left">
                  <span className="text-xs uppercase text-slate-300">
                    GitHub
                  </span>
                  <span className="leading-tight font-semibold">
                    Bahri232
                  </span>
                </div>
              </a>
            </div>
          </div>
          <Image
            src={heroImage}
            alt={t("landingPage.section1.heroImageAlt")}
            sizes="100%"
            className="flex-1 scale-75 lg:scale-100"
          />
        </section>
        <section className="container flex flex-col-reverse items-center justify-between gap-16 p-0 lg:flex-row lg:items-center lg:gap-0">
          <Image
            src={showcase}
            alt={t("landingPage.section2.showcaseAlt")}
            width={600}
            height={400}
            className="scale-90 lg:scale-100"
          />
          <div className=" text-center lg:w-[37%] lg:text-left">
            <h1 className="text-5xl font-bold text-landing-text lg:text-6xl">
              {t("landingPage.section2.featuresTitle")} <br />
              {t("landingPage.section2.restaurantSuccess")}
            </h1>
          </div>
        </section>
        <section className="mt-8 space-y-8 px-4 lg:mt-0 lg:max-w-[60%] lg:space-y-16 lg:px-0">
          <h2 className="text-center text-5xl font-bold text-landing-text">
            {t("landingPage.section2.discoverWhy")}
          </h2>
          <ul className="mx-auto flex w-[80%] flex-col items-center gap-8 lg:mx-0 lg:w-full lg:flex-row lg:items-start">
            <li className="flex-1">
              <h3 className="mb-4 text-center text-3xl text-landing-text">
                {t("landingPage.section2.createCustomize")}{" "}
                <span className="underline decoration-landing-primary underline-offset-0">
                  {t("landingPage.section2.onlineMenus")}
                </span>
              </h3>
              <p className="text-justify font-light text-landing-secondary">
                {t("landingPage.section2.onlineMenusDescription")}
              </p>
            </li>
            <li className="flex-1">
              <h3 className="mb-4 text-center text-3xl text-landing-text">
                {t("landingPage.section2.generateQR")}{" "}
                <span className="underline decoration-landing-accent underline-offset-0">
                  {t("landingPage.section2.qrCodes")}
                </span>{" "}
                {t("landingPage.section2.streamlinedOrders")}
              </h3>
              <p className="text-justify font-light text-landing-secondary">
                {t("landingPage.section2.qrCodesDescription")}
              </p>
            </li>
            <li className="flex-1">
              <h3 className="mb-4 text-center text-3xl text-landing-text">
                <span className="underline decoration-landing-primary underline-offset-0">
                  {t("landingPage.section2.easyMenu")}
                </span>{" "}
                {t("landingPage.section2.priceManagement")}
              </h3>
              <p className="text-justify font-light text-landing-secondary">
                {t("landingPage.section2.menuPriceManagementDescription")}
              </p>
            </li>
          </ul>
          <hr className="border-landing-secondary" />
          <div className="flex flex-col-reverse items-center justify-between gap-8 lg:flex-row lg:gap-0">
            <ul className="w-[80%] space-y-16 lg:w-1/2">
              <li>
                <h3 className="mb-2 text-center text-3xl text-landing-text underline decoration-landing-accent underline-offset-2 lg:text-left">
                  {t("landingPage.section2.manageOnlineOrders")}
                </h3>
                <p className="mx-auto w-3/4 text-justify  font-light text-landing-secondary lg:mx-0">
                  {t("landingPage.section2.manageOnlineOrdersDescription")}
                </p>
              </li>
              <li>
                <h3 className="mb-2 text-center text-3xl text-landing-text underline decoration-landing-primary underline-offset-2 lg:text-left">
                  {t("landingPage.section2.enhanceCustomerService")}
                </h3>
                <p className="mx-auto w-3/4 text-justify font-light  text-landing-secondary lg:mx-0">
                  {t("landingPage.section2.enhanceCustomerServiceDescription")}
                </p>
              </li>
            </ul>
            <Image
              src={showcaseMobile}
              alt={t("landingPage.section2.showcaseMobileAlt")}
              sizes="100%"
              height={485}
              width={330}
              className=""
            />
          </div>
        </section>
        <PricingSection />
      </main>
      <Footer />
    </>
  );
};
