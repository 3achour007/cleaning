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
            <h1 className="text-2xl font-bold cursor-pointer">Elite Cleaning</h1>
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
                At <strong className="text-blue-600">Elite Cleaning</strong>, we are more than just a cleaning company—we are your partners in creating a cleaner, healthier, and more sustainable environment. With years of experience in the industry, we have built a reputation for delivering <strong>top-notch cleaning solutions</strong> tailored to the unique needs of homes and businesses.
              </p>
              <p>
                What sets us apart is our commitment to using <strong className="text-green-600">100% bio-based cleaning products</strong>. Unlike traditional cleaning chemicals, our eco-friendly solutions are derived from natural ingredients that are safe for your family, pets, and the planet. Here’s why choosing bio products matters:
              </p>
              <ul className="list-disc list-inside space-y-4 pl-6">
                <li>
                  <strong>Safe for Your Health:</strong> Our bio products are free from harsh chemicals, toxins, and allergens, ensuring a safe and healthy environment for everyone.
                </li>
                <li>
                  <strong>Eco-Friendly:</strong> By using biodegradable and sustainable ingredients, we reduce our environmental footprint and contribute to a greener future.
                </li>
                <li>
                  <strong>Effective Cleaning:</strong> Don’t let the word "natural" fool you—our bio products are highly effective at removing dirt, grime, and stains, leaving your space spotless.
                </li>
                <li>
                  <strong>Gentle on Surfaces:</strong> Our products are designed to clean thoroughly without damaging your furniture, floors, or appliances.
                </li>
              </ul>
              <p>
                Whether you need a one-time deep clean or regular maintenance, our team of <strong>trained professionals</strong> is here to provide exceptional service with a personal touch. We take pride in our attention to detail, reliability, and dedication to customer satisfaction.
              </p>
              <p>
                Join us in making a positive impact on the environment while enjoying a cleaner, healthier space. <strong className="text-blue-600">Choose Elite Cleaning</strong>—where cleanliness meets sustainability.
              </p>
            </div>
          </div>
        </section>

        {/* Guarantees Section */}
        <section id="guarantees" className="py-16 bg-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Why Choose Elite Cleaning in {userCity}?
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
                  With nearly a decade of experience, we’ve mastered the art of delivering exceptional cleaning services tailored to your needs.
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
                  We take pride in offering top-tier cleaning services that exceed expectations, ensuring your space is spotless every time.
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
                  Your satisfaction is our priority. We listen carefully to your needs and provide customized solutions that work for you.
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
                  From homes to offices and beyond, we offer a wide range of cleaning services to meet every requirement.
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
            <strong>Phone:</strong> +1 (123) 456-7890
          </p>
          <p>
            <strong>Email:</strong> info@elitecleaning.cleaning
          </p>
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
                Phone: +1 (438) 408-2316<br />
                Email: info@elitecleaning.cleaning<br />
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
              &copy; {new Date().getFullYear()} Elite Cleaning. All rights reserved.
            </p>
            <p className="text-gray-300 mt-2">
              Designed with ❤️ by Elite Cleaning
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}