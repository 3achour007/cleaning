export default function Footer() {
    return (
        <footer className="w-full py-12 bg-gray-800 text-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Address */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Our Location</h4>
              <p className="text-gray-300">
                4745 Rue Sainte-Catherine E<br />
                Montreal, H1V 1Z3          <br />
                Quebec
              </p>
            </div>

            {/* Schedule */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Working Hours</h4>
              <p className="text-gray-300">
                Monday - Friday: 8:00 AM - 6:00 PM<br />
                Saturday: 9:00 AM - 4:00 PM<br />
                Sunday: Closed
              </p>
            </div>

            {/* Contact Information */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <p className="text-gray-300">
                Phone: +1 (438) 408-2316<br />
                Email: info@ecofriendlyclean.ca<br />

              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#services" className="text-gray-300 hover:text-blue-400">
                    Services
                  </a>
                </li>
                <li>
                  <a href="#about" className="text-gray-300 hover:text-blue-400">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-gray-300 hover:text-blue-400">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#guarantees" className="text-gray-300 hover:text-blue-400">
                    Our Guarantees
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-300">
              &copy; {new Date().getFullYear()} Cleaning Service. All rights reserved.
            </p>
            <p className="text-gray-300 mt-2">
              Designed with ❤️ by Eco Friendly Cleaning
            </p>
          </div>
        </div>
      </footer>
    );
  }