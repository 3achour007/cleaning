"use client"; // Mark this component as a Client Component

export default function Banner() {
  return (
    <div
      className="w-full bg-cover bg-center flex items-center justify-center text-white relative"
      style={{
        backgroundImage: "url('/images/cleaning.jpg')", // Path to your banner image
        height: "600px", // Default height for smaller screens
        backgroundRepeat: "no-repeat", // Prevent image duplication
        backgroundSize: "cover", // Ensure the image covers the entire banner
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Content */}
      <div className="text-center relative z-10">
        <h2 className="text-3xl sm:text-5xl font-bold mb-8">
          Special Cleaning Offer!
        </h2>
        <p className="text-lg sm:text-xl mb-8" style={{ textShadow: '2px 2px 8px rgb(14, 11, 156)' }}>
          Get 20% off on your first cleaning service.
        </p>
        <a
          href="https://calendly.com/tarikyabou/15min" // Replace with your Calendly link
          target="_blank" // Opens the link in a new tab
          rel="noopener noreferrer" // Recommended for security with target="_blank"
          className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 mt-12" 
        >
          Book Now
        </a>
        {/* Phone Number */}
        <p className="mt-4 text-lg sm:text-xl" style={{ textShadow: '2px 2px 8px rgb(14, 11, 156)' }}>
          Or call us at:{" "}
          <a
            href="tel:+14388145432" // Replace with your phone number
            className="text-blue-300 hover:text-blue-400 underline" 
          >
            +1 (438) 814-5432
          </a>
        </p>
      </div>
    </div>
  );
}