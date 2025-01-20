'use client';

import { useState, useEffect } from 'react';
import { db } from '@/firebase';
import {
  PencilIcon,
  TrashIcon,
  NoSymbolIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import WorkerDetails from './WorkerDetails';
import {
  addDoc,
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore';

// Define the Availability type
interface Availability {
  Monday: { startTime: string; endTime: string };
  Tuesday: { startTime: string; endTime: string };
  Wednesday: { startTime: string; endTime: string };
  Thursday: { startTime: string; endTime: string };
  Friday: { startTime: string; endTime: string };
  Saturday: { startTime: string; endTime: string };
  Sunday: { startTime: string; endTime: string };
}

// Define the Worker type
interface Worker {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  availability: Availability;
  status: string;
  password: string;
}

// Generate time options from 8:00 AM to 8:00 PM in 30-minute intervals
const generateTimeOptions = () => {
  const times = ['OFF'];
  for (let hour = 8; hour <= 20; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour % 12 || 12}:${minute === 0 ? '00' : minute} ${hour < 12 ? 'AM' : 'PM'}`;
      times.push(time);
    }
  }
  return times;
};

const timeOptions = generateTimeOptions();

// Helper function to group consecutive days with the same availability
const groupAvailability = (availability: Availability) => {
  const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  const grouped: string[] = [];
  let startDay = days[0];
  let currentAvailability = availability[startDay as keyof Availability];

  for (let i = 1; i < days.length; i++) {
    const day = days[i];
    const nextAvailability = availability[day as keyof Availability];

    if (
      nextAvailability.startTime === currentAvailability.startTime &&
      nextAvailability.endTime === currentAvailability.endTime
    ) {
      continue;
    }

    const lastDay = days[i - 1];
    if (currentAvailability.startTime === 'OFF') {
      grouped.push(
        `${startDay === lastDay ? `${startDay}` : `${startDay} - ${lastDay}`}: OFF`
      );
    } else {
      grouped.push(
        `${startDay === lastDay ? `${startDay}` : `${startDay} - ${lastDay}`}: ${currentAvailability.startTime} - ${currentAvailability.endTime}`
      );
    }

    startDay = day;
    currentAvailability = nextAvailability;
  }

  // Handle the last day
  const lastDay = days[days.length - 1];
  if (currentAvailability.startTime === 'OFF') {
    grouped.push(
      `${startDay === lastDay ? `${startDay}` : `${startDay} - ${lastDay}`}: OFF`
    );
  } else {
    grouped.push(
      `${startDay === lastDay ? `${startDay}` : `${startDay} - ${lastDay}`}: ${currentAvailability.startTime} - ${currentAvailability.endTime}`
    );
  }

  return grouped;
};

export default function Workers() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(null);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [isAddingWorker, setIsAddingWorker] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingWorkerId, setEditingWorkerId] = useState<string | null>(null);
  const [newWorker, setNewWorker] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    availability: {
      Monday: { startTime: '8:00 AM', endTime: '8:00 PM' },
      Tuesday: { startTime: '8:00 AM', endTime: '8:00 PM' },
      Wednesday: { startTime: '8:00 AM', endTime: '8:00 PM' },
      Thursday: { startTime: '8:00 AM', endTime: '8:00 PM' },
      Friday: { startTime: '8:00 AM', endTime: '8:00 PM' },
      Saturday: { startTime: '8:00 AM', endTime: '8:00 PM' },
      Sunday: { startTime: '8:00 AM', endTime: '8:00 PM' },
    } as Availability,
    password: '',
  });

  // Fetch workers from Firestore on component mount
  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'workers'));
        const workersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Worker[];
        setWorkers(workersData);
      } catch (error) {
        console.error('Error fetching workers: ', error);
      }
    };

    fetchWorkers();
  }, []);

  // Fetch selected worker details from Firestore
  useEffect(() => {
    const fetchSelectedWorker = async () => {
      if (selectedWorkerId) {
        try {
          const workerDoc = await getDoc(doc(db, 'workers', selectedWorkerId));
          if (workerDoc.exists()) {
            setSelectedWorker({
              id: workerDoc.id,
              ...workerDoc.data(),
            } as Worker);
          } else {
            console.error('Worker not found');
            setSelectedWorker(null);
          }
        } catch (error) {
          console.error('Error fetching worker details: ', error);
          setSelectedWorker(null);
        }
      } else {
        setSelectedWorker(null);
      }
    };

    fetchSelectedWorker();
  }, [selectedWorkerId]);

  // Handle edit worker
  const handleEdit = (worker: Worker) => {
    setIsEditing(true);
    setEditingWorkerId(worker.id);
    setNewWorker({
      name: worker.name,
      email: worker.email,
      phone: worker.phone,
      address: worker.address,
      availability: worker.availability,
      password: worker.password,
    });
  };

  // Handle delete worker
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this worker?')) {
      try {
        await deleteDoc(doc(db, 'workers', id));
        setWorkers(workers.filter((worker) => worker.id !== id));
      } catch (error) {
        console.error('Error deleting worker: ', error);
      }
    }
  };

  // Handle suspend worker
  const handleSuspend = async (id: string) => {
    if (
      window.confirm("Are you sure you want to toggle the worker's status?")
    ) {
      try {
        const worker = workers.find((worker) => worker.id === id);
        if (!worker) return;

        const newStatus = worker.status === 'Active' ? 'Suspended' : 'Active';
        await updateDoc(doc(db, 'workers', id), { status: newStatus });
        setWorkers(
          workers.map((worker) =>
            worker.id === id ? { ...worker, status: newStatus } : worker
          )
        );
      } catch (error) {
        console.error('Error updating worker status: ', error);
      }
    }
  };

  // Handle form submission for adding/editing worker
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      newWorker.name &&
      newWorker.email &&
      newWorker.phone &&
      newWorker.address &&
      newWorker.password
    ) {
      try {
        if (isEditing && editingWorkerId) {
          // Update existing worker in Firestore
          await updateDoc(doc(db, 'workers', editingWorkerId), {
            ...newWorker,
          });

          // Update local state
          setWorkers(
            workers.map((worker) =>
              worker.id === editingWorkerId
                ? { ...worker, ...newWorker }
                : worker
            )
          );
        } else {
          // Add new worker to Firestore
          const docRef = await addDoc(collection(db, 'workers'), {
            ...newWorker,
            status: 'Active',
          });

          // Update local state
          const newWorkerWithId: Worker = {
            id: docRef.id,
            ...newWorker,
            status: 'Active',
          };
          setWorkers([...workers, newWorkerWithId]);
        }

        // Reset form
        setNewWorker({
          name: '',
          email: '',
          phone: '',
          address: '',
          availability: {
            Monday: { startTime: '8:00 AM', endTime: '8:00 PM' },
            Tuesday: { startTime: '8:00 AM', endTime: '8:00 PM' },
            Wednesday: { startTime: '8:00 AM', endTime: '8:00 PM' },
            Thursday: { startTime: '8:00 AM', endTime: '8:00 PM' },
            Friday: { startTime: '8:00 AM', endTime: '8:00 PM' },
            Saturday: { startTime: '8:00 AM', endTime: '8:00 PM' },
            Sunday: { startTime: '8:00 AM', endTime: '8:00 PM' },
          },
          password: '',
        });
        setIsAddingWorker(false);
        setIsEditing(false);
        setEditingWorkerId(null);
      } catch (error) {
        console.error('Error adding/updating document: ', error);
        alert('Failed to save worker. Please try again.');
      }
    } else {
      alert('Please fill in all fields correctly.');
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Workers</h2>

      {/* Add Worker Button */}
      <button
        onClick={() => {
          setIsAddingWorker(true);
          setIsEditing(false);
          setEditingWorkerId(null);
        }}
        className="mb-6 flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        <PlusIcon className="h-5 w-5 mr-2" />
        Add Worker
      </button>

      {/* Add/Edit Worker Form */}
      {(isAddingWorker || isEditing) && (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={newWorker.name}
              onChange={(e) =>
                setNewWorker({ ...newWorker, name: e.target.value })
              }
              className="p-2 border border-gray-300 rounded-lg"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={newWorker.email}
              onChange={(e) =>
                setNewWorker({ ...newWorker, email: e.target.value })
              }
              className="p-2 border border-gray-300 rounded-lg"
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={newWorker.phone}
              onChange={(e) =>
                setNewWorker({ ...newWorker, phone: e.target.value })
              }
              className="p-2 border border-gray-300 rounded-lg"
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={newWorker.address}
              onChange={(e) =>
                setNewWorker({ ...newWorker, address: e.target.value })
              }
              className="p-2 border border-gray-300 rounded-lg"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={newWorker.password}
              onChange={(e) =>
                setNewWorker({ ...newWorker, password: e.target.value })
              }
              className="p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          {/* Availability Section */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Availability
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.keys(newWorker.availability).map((day) => (
                <div key={day} className="flex flex-col space-y-2">
                  <label className="text-sm text-gray-600 mb-1">{day}</label>
                  <div className="flex space-x-2">
                    <select
                      value={
                        newWorker.availability[day as keyof Availability]
                          .startTime
                      }
                      onChange={(e) => {
                        const value = e.target.value;
                        setNewWorker((prev) => ({
                          ...prev,
                          availability: {
                            ...prev.availability,
                            [day]: {
                              startTime: value,
                              endTime:
                                value === 'OFF'
                                  ? 'OFF'
                                  : prev.availability[day as keyof Availability]
                                      .endTime,
                            },
                          },
                        }));
                      }}
                      className="p-2 border border-gray-300 rounded-lg"
                    >
                      {timeOptions.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                    <select
                      value={
                        newWorker.availability[day as keyof Availability]
                          .endTime
                      }
                      onChange={(e) => {
                        const value = e.target.value;
                        setNewWorker((prev) => ({
                          ...prev,
                          availability: {
                            ...prev.availability,
                            [day]: {
                              startTime:
                                value === 'OFF'
                                  ? 'OFF'
                                  : prev.availability[day as keyof Availability]
                                      .startTime,
                              endTime: value,
                            },
                          },
                        }));
                      }}
                      className="p-2 border border-gray-300 rounded-lg"
                      disabled={
                        newWorker.availability[day as keyof Availability]
                          .startTime === 'OFF'
                      }
                    >
                      {timeOptions.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Buttons */}
          <div className="mt-6">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              {isEditing ? 'Update Worker' : 'Save Worker'}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAddingWorker(false);
                setIsEditing(false);
                setEditingWorkerId(null);
              }}
              className="ml-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Workers Table */}
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
                Availability
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {workers.map((worker) => {
              const groupedAvailability = groupAvailability(
                worker.availability
              );
              return (
                <tr
                  key={worker.id}
                  onClick={() => setSelectedWorkerId(worker.id)}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {worker.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {worker.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {worker.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {worker.address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="space-y-1">
                      {groupedAvailability.map((group, index) => (
                        <div key={index}>{group}</div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        worker.status === 'Active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {worker.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(worker);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(worker.id);
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSuspend(worker.id);
                        }}
                        className="text-yellow-600 hover:text-yellow-900"
                      >
                        <NoSymbolIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Display Worker Details */}
      {selectedWorker && (
        <div className="mt-8">
          <WorkerDetails worker={selectedWorker} />
        </div>
      )}
    </div>
  );
}
