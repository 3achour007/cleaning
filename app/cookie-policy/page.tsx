import Navbar from './../../compononts/Navbar';
import Footer from './../../compononts/Footer';

export default function CookiePolicy() {
  return (
    <>
      <Navbar />
      <section id="cookie-policy" className="py-16 bg-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1
            className="text-4xl font-bold text-center mb-8"
            style={{
              color: '#432db5',
              textShadow: '2px 2px 8px #FF0000',
            }}
          >
            Cookie Policy
          </h1>
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Cookies: What Are They?</h2>
            <p className="mb-4">
              Cookies are small text files that are stored on your computer or
              mobile device when you visit a website. They are widely used to
              improve website functionality and provide valuable information to
              website owners.
            </p>

            <h2 className="text-2xl font-bold mb-4">How We Use Cookies</h2>
            <p className="mb-4">We use cookies for the following purposes:</p>
            <ul className="list-disc list-inside mb-4">
              <li>
                <strong>Enable Website Features</strong>: To allow certain
                functions of the website to work properly.
              </li>
              <li>
                <strong>Analytics and Improvement</strong>: To analyze website
                traffic and improve user experience.
              </li>
              <li>
                <strong>Personalization</strong>: To store your preferences and
                tailor your experience on our website.
              </li>
            </ul>

            <h2 className="text-2xl font-bold mb-4">Handling Cookies</h2>
            <p className="mb-4">
              You can manage or delete cookies at any time. For more
              information, visit{' '}
              <a
                href="https://www.aboutcookies.org"
                className="text-blue-600 hover:underline"
              >
                aboutcookies.org
              </a>
              . Most browsers allow you to block cookies, and you can also
              delete all cookies stored on your device. However, if you choose
              to block cookies, some website features may not function properly,
              and you may need to manually adjust your preferences each time you
              visit.
            </p>

            <h2 className="text-2xl font-bold mb-4">
              Modifications to This Policy
            </h2>
            <p className="mb-4">
              We may update our Cookie Policy from time to time. Any changes
              will be posted on this page, and we encourage you to review this
              policy periodically to stay informed.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
