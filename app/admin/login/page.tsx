'use client';

import { useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase'; // Ensure this points to your Firebase config file
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Check if the user is already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log('User is already logged in:', user);

        try {
          // Check if the user is an admin
          const adminDocRef = doc(db, 'admin', user.uid); // Check the `admin` collection
          const adminDoc = await getDoc(adminDocRef);

          if (adminDoc.exists() && adminDoc.data()?.isAdmin) {
            console.log('User is an admin.');
            router.push('/admin'); // Redirect to admin dashboard
          } else {
            console.log('User is not an admin.');
            await signOut(auth); // Log out the user if they are not an admin
          }
        } catch (error) {
          console.error('Error checking admin status:', error);
          setError('An error occurred. Please try again.');
        }
      }
    });

    return () => unsubscribe(); // Cleanup subscription
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    console.log('Attempting to log in with:', email, password); // Debugging

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log('Login successful:', userCredential.user); // Debugging

      // Check if the user is an admin
      const user = userCredential.user;
      const adminDocRef = doc(db, 'admin', user.uid); // Check the `admin` collection
      const adminDoc = await getDoc(adminDocRef);

      if (adminDoc.exists() && adminDoc.data()?.isAdmin) {
        console.log('User is an admin.');
        router.push('/admin'); // Redirect to admin dashboard
      } else {
        console.log('User is not an admin.');
        setError('You do not have admin access.');
        await signOut(auth); // Log out the user if they are not an admin
      }
    } catch (error) {
      console.error('Login error:', error); // Debugging
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
