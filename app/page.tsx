"use client"; // Mark this component as a Client Component

import { useEffect, useState } from "react";
import Banner from "./../compononts/Banner"; // Import the Banner component
import Link from 'next/link';

export default function Home() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to manage menu visibility
  const [userCity, setUserCity] = useState<string>("Montreal"); // Default city

  useEffect(() => {
    // Set the current year only on the client side
    setCurrentYear(new Date().getFullYear());

    // Detect user's city based on IP address
    detectUserCity();
  }, []);

  const detectUserCity = async () => {
    try {
      // Use IP-API to get the user's city based on their IP address
      const response = await fetch("http://ip-api.com/json/?fields=city");
      const data = await response.json();
      if (data.city) {
        setUserCity(data.city);
      }
    } catch (error) {
      console.error("Error fetching user city:", error);
      // Fallback to default city if there's an error
      setUserCity("Montreal");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="w-full max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center py-4 px-4 sm:px-0">
        {/* Title and Hamburger Menu Button (Mobile Only) */}
        <div className="w-full sm:w-auto flex justify-between items-center">
          <Link href="/">
            <h1 className="text-2xl font-bold cursor-pointer">Eco Friendly Cleaning</h1>
          </Link>

          {/* Hamburger Menu Button (Mobile Only) */}
          <button
            className="sm:hidden p-2 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
        </div>

        {/* Navigation Menu */}
        <nav
          className={`${isMenuOpen ? "block" : "hidden"} sm:block w-full sm:w-auto mt-4 sm:mt-0`}
        >
          <ul className="flex flex-col sm:flex-row sm:space-x-4">
            <li>
              <a
                href="/"
                className="block py-2 sm:py-0 hover:underline"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#services"
                className="block py-2 sm:py-0 hover:underline"
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </a>
            </li>
            <li>
              <a
                href="#about"
                className="block py-2 sm:py-0 hover:underline"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </a>
            </li>
            <li>
              <a
                href="#guarantees"
                className="block py-2 sm:py-0 hover:underline"
                onClick={() => setIsMenuOpen(false)}
              >
                Our Guarantees
              </a>
            </li>
            <li>
              <a
                href="/contact"
                className="block py-2 sm:py-0 hover:underline"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </a>
            </li>
            {/* Language Switcher */}
            <li className="flex items-center">
              <a
                href="/" // Link to the English version
                className="block py-2 sm:py-0 hover:underline"
                onClick={() => setIsMenuOpen(false)}
              >
                English
              </a>
              <span className="mx-2 text-gray-400">|</span>
              <a
                href="/fr" // Link to the French version
                className="block py-2 sm:py-0 hover:underline"
                onClick={() => setIsMenuOpen(false)}
              >
                Français
              </a>
            </li>
          </ul>
        </nav>
      </header>

      {/* Banner */}
      <Banner />

      {/* Main Content */}
      <main className="flex-1 w-full text-center">
        {/* Hero Section */}
        <section className="py-16 max-w-5xl mx-auto">
          <h1 className="text-4xl font-extrabold mb-4">
            Eco-Friendly Cleaning Services in {userCity}
          </h1>
          <p className="text-lg mb-8">
            Professional and affordable cleaning services tailored for your home or office in {userCity}. We use 100% bio-based cleaning products for a healthier environment.
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="#services"
              className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
            >
              See Our Services
            </a>
            <a
              href="/contact"
              className="px-6 py-3 bg-gray-200 text-gray-900 rounded-lg shadow hover:bg-gray-300"
            >
              Contact Us
            </a>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-16 max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">
            Our Cleaning Services in {userCity}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Office Cleaning */}
            <div className="p-6 bg-white rounded-lg shadow text-center">
              <h3 className="text-xl font-semibold mb-2">
                Office Cleaning in {userCity}
              </h3>
              <p>
                Keep your workspace clean, organized, and professional with our expert office cleaning services.
              </p>
            </div>

            {/* Garage Cleaning */}
            <div className="p-6 bg-white rounded-lg shadow text-center">
              <h3 className="text-xl font-semibold mb-2">
                Garage Cleaning in {userCity}
              </h3>
              <p>
                Transform your garage into a clean and functional space with our thorough garage cleaning solutions.
              </p>
            </div>

            {/* Clean Common Areas */}
            <div className="p-6 bg-white rounded-lg shadow text-center">
              <h3 className="text-xl font-semibold mb-2">
                Common Area Cleaning in {userCity}
              </h3>
              <p>
                Ensure shared spaces like lobbies, hallways, and staircases are spotless and welcoming.
              </p>
            </div>

            {/* Residential Cleaning */}
            <div className="p-6 bg-white rounded-lg shadow text-center">
              <h3 className="text-xl font-semibold mb-2">
                Residential Cleaning in {userCity}
              </h3>
              <p>
                Enjoy a clean and comfortable home with our tailored residential cleaning services.
              </p>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section
          id="about"
          className="py-24 w-[100%] mx-auto bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/nature.jpg')", // Path to your background image
          }}
        >
          <div className="px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-8 text-center">
              About Our Eco-Friendly Cleaning Services
            </h2>
            <div className="text-lg sm:text-xl text-gray-700 space-y-8 text-left mx-auto w-full sm:w-3/4 lg:w-1/2 px-4 sm:px-0">
              <p>
                We are more than just a cleaning service at <strong className="text-blue-600">Eco Friendly Cleaning</strong>; we are your collaborators in making the world a better, cleaner, and more sustainable place. With years of experience in the field, we have established a solid reputation for providing excellent cleaning solutions that are customized to meet the specific requirements of both households and businesses.
              </p>
              <p>
                Our dedication to employing <strong className="text-green-600">100% bio-based cleaning free of chemicals</strong> is what makes us unique. Our environmentally friendly cleaning products, in contrast to conventional ones, are made from natural materials that are safe for the environment, your family, and your pets. This is why selecting bioproducts is important:
              </p>
              <ul className="list-disc list-inside space-y-4 pl-6">
                <li>
                  <strong>It's Safe for Your Health:</strong> Because our bio products are devoid of allergens, toxins, and harsh chemicals, everyone can live in a safe and healthy environment.
                </li>
                <li>
                  <strong>Friendly to the Environment:</strong> We lessen our impact on the environment and help create a better future by employing sustainable and biodegradable components.
                </li>
                <li>
                  <strong>Cleaning Effectively:</strong> Don't be misled by the term "natural"; our bio solutions are quite good at getting rid of stains, filth, and grime, leaving your area pristine.
                </li>
                <li>
                  <strong>It's Gentle on Surfaces:</strong> Our products are made to clean your appliances, floors, and furniture completely without causing any damage.
                </li>
              </ul>
              <p>
                Our staff of <strong>trained professionals</strong> is available to offer outstanding service with a personal touch, whether you require routine maintenance or a one-time deep clean. We are proud of our meticulousness, dependability, and commitment to client satisfaction.
              </p>
              <p>
                Come along with us as we improve the environment and enjoy a healthier, cleaner space. <strong className="text-blue-600">Select eco-friendly cleaning</strong>, where sustainability and cleanliness coexist.
              </p>
            </div>
          </div>
        </section>

        {/* Guarantees Section */}
        <section id="guarantees" className="py-16 bg-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Why Choose Eco Friendly Cleaning in {userCity}?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Experience */}
              <div className="p-6 bg-white rounded-lg shadow text-center">
                <img
                  src="/images/expertise.jpg" // Path to your image
                  alt="Proven Expertise in Cleaning Services"
                  className="w-full h-48 object-cover mb-4 sm:w-48 sm:h-32"
                />
                <h3 className="text-xl font-semibold mb-2">
                  Proven Expertise
                </h3>
                <p>
                With almost ten years of expertise, we've perfected the art of providing outstanding cleaning services that are customized to meet your demands.

                </p>
              </div>

              {/* Service Quality */}
              <div className="p-6 bg-white rounded-lg shadow text-center">
                <img
                  src="/images/quality.png" // Path to your image
                  alt="Unmatched Quality in Cleaning Services"
                  className="w-full h-48 object-cover mb-4 sm:w-48 sm:h-32"
                />
                <h3 className="text-xl font-semibold mb-2">
                  Unmatched Quality
                </h3>
                <p>
                We take pleasure in providing superior cleaning services that go above and above to leave your place immaculate every time.
                </p>
              </div>

              {/* Professionalism */}
              <div className="p-6 bg-white rounded-lg shadow text-center">
                <img
                  src="/images/customer.jpeg" // Path to your image
                  alt="Client-Centric Cleaning Services"
                  className="w-full h-48 object-cover mb-4 sm:w-48 sm:h-32"
                />
                <h3 className="text-xl font-semibold mb-2">
                  Client-Centric Approach
                </h3>
                <p>
                We put your satisfaction first. We pay close attention to your demands and offer tailored solutions that suit you.
                </p>
              </div>

              {/* Versatility */}
              <div className="p-6 bg-white rounded-lg shadow text-center">
                <img
                  src="/images/Deep-Cleaning.jpg" // Path to your image
                  alt="Comprehensive Cleaning Solutions"
                  className="w-full h-48 object-cover mb-4 sm:w-48 sm:h-32"
                />
                <h3 className="text-xl font-semibold mb-2">
                  Comprehensive Solutions
                </h3>
                <p>
                We provide a broad range of cleaning services to satisfy any need, from homes to workplaces and beyond.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">
            Contact Us for Eco-Friendly Cleaning in {userCity}
          </h2>
          <p className="mb-4">
            For inquiries or to book our services, please call or email us.
          </p>
          <p>
            <strong>Phone:</strong> +1 (438) 814-5432
          </p>
          <p>
            <strong>Email:</strong> info@ecofriendlyclean.ca
          </p>
        </section>

        <section className="w-full">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2794.391986840822!2d-73.5694836844385!3d45.50170297910173!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4cc91a6a5b5b5b5b%3A0x5b5b5b5b5b5b5b5b!2s4745%20Rue%20Sainte-Catherine%20E%2C%20Montreal%2C%20QC%20H1V%201Z3!5e0!3m2!1sen!2sca!4v1633020000000!5m2!1sen!2sca"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
          ></iframe>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 bg-gray-800 text-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Address */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Our Location</h4>
              <p className="text-gray-300">
                4745 Rue Sainte-Catherine E<br />
                Montreal, H1V 1Z3<br />
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
                Phone: +1 (438) 814-5432<br />
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
                  <a href="/contact" className="text-gray-300 hover:text-blue-400">
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
              &copy; {new Date().getFullYear()} Eco Friendly Cleaning. All rights reserved.
            </p>
            <p className="text-gray-300 mt-2">
              Designed with ❤️ by Eco Friendly Cleaning
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}