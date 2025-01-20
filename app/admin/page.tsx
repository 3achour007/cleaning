'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/firebase';
import { useRouter } from 'next/navigation'; // Use Next.js's useRouter
import DashboardContent from './DashboardContent';
import Workers from './Workers';
import Clients from './Clients';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'; // Import icons for the toggle button

export default function AdminPage() {
  const router = useRouter(); // Use Next.js's useRouter
  const [showDashboard, setShowDashboard] = useState(false);
  const [showWorkers, setShowWorkers] = useState(false);
  const [showClients, setShowClients] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to control sidebar visibility

  // Check if the user is authenticated
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push('/admin/login'); // Redirect to login page if user is not authenticated
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar Toggle Button (Mobile Only) */}
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-lg md:hidden"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? (
          <XMarkIcon className="h-6 w-6" /> // Close icon when sidebar is open
        ) : (
          <Bars3Icon className="h-6 w-6" /> // Hamburger icon when sidebar is closed
        )}
      </button>

      {/* Sidebar */}
      <div
        className={`bg-white w-64 p-6 shadow-lg fixed inset-0 md:relative transform transition-transform duration-200 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 z-40`}
      >
        <h1 className="text-2xl font-bold text-blue-600 mb-8">Admin Panel</h1>
        <nav>
          <ul className="space-y-4">
            <li>
              <button
                onClick={() => {
                  setShowDashboard(true); // Show Dashboard
                  setShowWorkers(false); // Hide Workers
                  setShowClients(false); // Hide Clients
                  setIsSidebarOpen(false); // Close sidebar on mobile after clicking
                }}
                className="block p-2 hover:bg-blue-50 rounded-lg text-gray-700 hover:text-blue-600"
              >
                Dashboard
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setShowWorkers(true); // Show Workers
                  setShowDashboard(false); // Hide Dashboard
                  setShowClients(false); // Hide Clients
                  setIsSidebarOpen(false); // Close sidebar on mobile after clicking
                }}
                className="block p-2 hover:bg-blue-50 rounded-lg text-gray-700 hover:text-blue-600"
              >
                Workers
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setShowClients(true); // Show Clients
                  setShowDashboard(false); // Hide Dashboard
                  setShowWorkers(false); // Hide Workers
                  setIsSidebarOpen(false); // Close sidebar on mobile after clicking
                }}
                className="block p-2 hover:bg-blue-50 rounded-lg text-gray-700 hover:text-blue-600"
              >
                Clients
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-x-hidden">
        {showDashboard && <DashboardContent />}
        {showWorkers && <Workers />}
        {showClients && <Clients />}
      </div>

      {/* Overlay for Mobile (Dark Background When Sidebar is Open) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)} // Close sidebar when clicking outside
        />
      )}
    </div>
  );
}
