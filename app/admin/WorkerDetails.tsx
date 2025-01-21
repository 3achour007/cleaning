'use client';

import { useState, useEffect } from 'react';
import { db } from '@/firebase'; // Adjust the import path as needed
import { collection, query, where, getDocs } from 'firebase/firestore';

// Define the Client type based on your Firestore structure
interface Client {
  id: string;
  address: string;
  assignedWorkerId: string;
  cleaningFrequency: string;
  cleaningType: string;
  cost: string;
  createdAt: string;
  deadline: string;
  email: string;
  laundryLoads: number;
  name: string;
  numberOfBalcony: number;
  numberOfBathrooms: string;
  numberOfKitchens: string;
  numberOfLivingRooms: string;
  numberOfRooms: string;
  numberOfWalls: number;
  numberOfWindows: number;
  phone: string;
  preferredDay: string;
  priority: string;
  propertyType: string;
  selectedServices: string[];
  status: string;
  superficialArea: string;
  title: string;
}

// Define the Worker type
interface Worker {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: string;
}

export default function WorkerDetails({ worker }: { worker: Worker }) {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch clients assigned to the worker
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clientsQuery = query(
          collection(db, 'clients'),
          where('assignedWorkerId', '==', worker.id)
        );
        const clientsSnapshot = await getDocs(clientsQuery);
        console.log(
          'Clients Snapshot:',
          clientsSnapshot.docs.map((doc) => doc.data())
        );

        const clientsData = clientsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Client[];
        setClients(clientsData);
      } catch (error) {
        console.error('Error fetching clients: ', error);
        setError('Failed to fetch clients');
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [worker.id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      {/* Assigned Clients */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Assigned Clients
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cleaning Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cost
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Property Type
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clients.map((client) => (
              <tr key={client.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {client.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {client.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {client.phone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {client.address}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {client.cleaningType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${client.cost}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {client.propertyType}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}