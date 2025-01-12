'use client'; // Required for client-side interactivity

import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
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
                </ul>
            </nav>
        </header>
    );
}