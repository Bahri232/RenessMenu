import Image from "next/image";
import Link from "next/link";
import Icon from "~/assets/icon.png";

export const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white/70 backdrop-blur-xs">
      <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <Link href="/" className="flex items-center">
              <Image
                src={Icon}
                className="me-3"
                height={32}
                width={32}
                alt="FeastQR Logo"
              />
              <span className="self-center whitespace-nowrap text-2xl font-bold text-slate-900">
                FeastQR
              </span>
            </Link>
            <p className="mt-2 text-sm text-slate-500 max-w-xs">
              Digital QR menus for modern restaurants. Designed and developed by{" "}
              <span className="font-semibold text-slate-800">
                Abdul Malik Barrie
              </span>
              .
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-6">
            <div>
              <h2 className="mb-6 text-xs font-black uppercase tracking-wider text-slate-900">
                Contact
              </h2>
              <ul className="space-y-3 font-medium text-slate-600">
                <li>
                  <a
                    href="https://wa.me/23280020097"
                    className="hover:underline flex items-center gap-1.5"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span>WhatsApp</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://x.com/abdul_m_barrie?s=11"
                    className="hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    X (@abdul_m_barrie)
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-xs font-black uppercase tracking-wider text-slate-900">
                Follow Us
              </h2>
              <ul className="space-y-3 font-medium text-slate-600">
                <li>
                  <a
                    href="https://github.com/Bahri232"
                    className="hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    GitHub (@Bahri232)
                  </a>
                </li>
                <li>
                  <a
                    href="https://x.com/abdul_m_barrie?s=11"
                    className="hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    X (Twitter)
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.facebook.com/share/1CUJ1RPV7k/?mibextid=wwXIfr"
                    className="hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Facebook
                  </a>
                </li>
                <li>
                  <a
                    href="https://wa.me/23280020097"
                    className="hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    WhatsApp Chat
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-xs font-black uppercase tracking-wider text-slate-900">
                Legal
              </h2>
              <ul className="flex flex-col gap-3 font-medium text-slate-600">
                <li>
                  <Link href="/privacy-policy" className="hover:underline">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms-of-service" className="hover:underline">
                    Terms &amp; Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/refund-policy" className="hover:underline">
                    Refund Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr className="my-6 border-slate-200 sm:mx-auto lg:my-8" />
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-slate-500 sm:text-center">
            © {new Date().getFullYear()}{" "}
            <Link href="/" className="hover:underline font-bold text-slate-800">
              FeastQR
            </Link>
            . Developed by{" "}
            <a
              href="https://x.com/abdul_m_barrie?s=11"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-slate-900 hover:underline"
            >
              Abdul Malik Barrie
            </a>
            .
          </span>
          <div className="mt-4 flex items-center sm:mt-0 sm:justify-center gap-4">
            {/* X / Twitter */}
            <a
              href="https://x.com/abdul_m_barrie?s=11"
              target="_blank"
              rel="noreferrer"
              className="text-slate-500 hover:text-slate-900 transition-colors"
              aria-label="X (Twitter) Profile"
            >
              <svg
                className="h-4 w-4 fill-current"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span className="sr-only">X (Twitter)</span>
            </a>

            {/* Facebook */}
            <a
              href="https://www.facebook.com/share/1CUJ1RPV7k/?mibextid=wwXIfr"
              target="_blank"
              rel="noreferrer"
              className="text-slate-500 hover:text-[#1877F2] transition-colors"
              aria-label="Facebook Profile"
            >
              <svg
                className="h-4 w-4 fill-current"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="sr-only">Facebook</span>
            </a>

            {/* GitHub */}
            <a
              href="https://github.com/Bahri232"
              target="_blank"
              rel="noreferrer"
              className="text-slate-500 hover:text-slate-900 transition-colors"
              aria-label="GitHub Profile"
            >
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
              <span className="sr-only">GitHub</span>
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/23280020097"
              target="_blank"
              rel="noreferrer"
              className="text-slate-500 hover:text-[#25D366] transition-colors"
              aria-label="WhatsApp Contact"
            >
              <svg
                className="h-4 w-4 fill-current"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span className="sr-only">WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
