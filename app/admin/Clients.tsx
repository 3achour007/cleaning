'use client';

import React, { useState, useEffect } from 'react';
import {
    doc,
    getDoc,
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
} from 'firebase/firestore';
import { FaTrash } from 'react-icons/fa'; // Import the trash icon
import { db, auth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';

// Define the types for Client and Worker
interface Client {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    assignedWorkerId: string;
    cleaningType: string;
    cleaningFrequency: string;
    selectedServices: string[];
    propertyType: string;
    superficialArea: string;
    numberOfKitchens: string;
    numberOfRooms: string;
    numberOfLivingRooms: string;
    numberOfBathrooms: string;
    numberOfWalls: number;
    numberOfWindows: number;
    numberOfBalcony: number;
    laundryLoads: number;
    cost: string;
    createdAt: string;
    deadline: string;
    preferredDay: string;
    priority: string;
    status: string;
    title: string;
}

const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
};

interface Worker {
    id: string;
    name: string;
    // Add other worker properties as needed
}

const superficialAreaOptions = [
    '500-1000 ft²',
    '1000-1500 ft²',
    '1500-2000 ft²',
    '2000-2500 ft²',
    '2500-3000 ft²',
    '3000-3500 ft²',
    '3500-4000 ft²',
    '4000-4500 ft²',
    '4500-5000 ft²',
];

const availableServices = [
    'Inside the Oven',
    'Inside the Fridge',
    'Garage Floor',
    'Dishes',
];

const Clients = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [clients, setClients] = useState<Client[]>([]); // Explicitly define the type for clients
    const [workers, setWorkers] = useState<Worker[]>([]); // Explicitly define the type for workers
    const [showAddClientForm, setShowAddClientForm] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [newClient, setNewClient] = useState<Client>({
        id: '',
        name: '',
        email: '',
        phone: '',
        address: '',
        assignedWorkerId: '',
        cleaningType: '',
        cleaningFrequency: '',
        selectedServices: [],
        propertyType: '',
        superficialArea: '',
        numberOfKitchens: '',
        numberOfRooms: '',
        numberOfLivingRooms: '',
        numberOfBathrooms: '',
        numberOfWalls: 0,
        numberOfWindows: 0,
        numberOfBalcony: 0,
        laundryLoads: 0,
        cost: '',
        createdAt: '',
        deadline: '',
        preferredDay: '',
        priority: '',
        status: '',
        title: '',
    });
    const router = useRouter();

    // Base prices and extras
    const basePrice = 50; // Base price for Apartment or House
    const standardCleaningExtra = 150; // Extra for Standard Cleaning
    const deepCleaningExtra = 350; // Extra for Deep Cleaning
    const roomBathroomExtra = 25; // Extra per room or bathroom
    const ovenExtra = 40; // Extra for cleaning inside the oven
    const fridgeExtra = 40; // Extra for cleaning inside the fridge

    // Calculate the total cost dynamically
    const calculateCost = () => {
        let totalCost = basePrice;

        // Add cleaning type extra
        if (newClient.cleaningType === 'Standard Cleaning') {
            totalCost += standardCleaningExtra;
        } else if (newClient.cleaningType === 'Deep Cleaning') {
            totalCost += deepCleaningExtra;
        }

        // Add extras for rooms and bathrooms
        const rooms = parseInt(newClient.numberOfRooms) || 0;
        const bathrooms = parseInt(newClient.numberOfBathrooms) || 0;
        totalCost += (rooms + bathrooms) * roomBathroomExtra;

        // Add extras for oven and fridge (if selected)
        if (newClient.selectedServices.includes('Inside the Oven')) {
            totalCost += ovenExtra; // $40 for inside the oven
        }
        if (newClient.selectedServices.includes('Inside the Fridge')) {
            totalCost += fridgeExtra; // $40 for inside the fridge
        }

        // Add extras for kitchens
        const kitchens = parseInt(newClient.numberOfKitchens) || 0;
        totalCost += kitchens * 25; // $25 per kitchen

        // Add extras for living rooms
        const livingRooms = parseInt(newClient.numberOfLivingRooms) || 0;
        totalCost += livingRooms * 15; // $15 per living room

        // Add extras for walls
        const walls = newClient.numberOfWalls || 0;
        totalCost += walls * 15; // $15 per wall

        // Add extras for windows
        const windows = newClient.numberOfWindows || 0;
        totalCost += windows * 15; // $15 per window

        // Add extras for balconies
        const balconies = newClient.numberOfBalcony || 0;
        totalCost += balconies * 45; // $45 per balcony

        // Add extras for laundry loads
        const laundryLoads = newClient.laundryLoads || 0;
        totalCost += laundryLoads * 10; // $10 per laundry load

        // Add extras for selected services (if applicable)
        if (newClient.selectedServices.includes('Garage Floor')) {
            totalCost += 45; // $45 for garage floor
        }
        if (newClient.selectedServices.includes('Dishes')) {
            totalCost += 10; // $10 for dishes
        }

        // Update the cost in the state
        setNewClient((prev) => ({
            ...prev,
            cost: totalCost.toString(),
        }));
    };

    const recalculateCost = (client: Client) => {
        let totalCost = basePrice;

        // Add cleaning type extra
        if (client.cleaningType === 'Standard Cleaning') {
            totalCost += standardCleaningExtra;
        } else if (client.cleaningType === 'Deep Cleaning') {
            totalCost += deepCleaningExtra;
        }

        // Add extras for rooms and bathrooms
        const rooms = parseInt(client.numberOfRooms) || 0;
        const bathrooms = parseInt(client.numberOfBathrooms) || 0;
        totalCost += (rooms + bathrooms) * roomBathroomExtra;

        // Add extras for oven and fridge (if selected)
        if (client.selectedServices.includes('Inside the Oven')) {
            totalCost += ovenExtra;
        }
        if (client.selectedServices.includes('Inside the Fridge')) {
            totalCost += fridgeExtra;
        }

        // Add extras for kitchens
        const kitchens = parseInt(client.numberOfKitchens) || 0;
        totalCost += kitchens * 25;

        // Add extras for living rooms
        const livingRooms = parseInt(client.numberOfLivingRooms) || 0;
        totalCost += livingRooms * 15;

        // Add extras for walls
        const walls = client.numberOfWalls || 0;
        totalCost += walls * 15;

        // Add extras for windows
        const windows = client.numberOfWindows || 0;
        totalCost += windows * 15;

        // Add extras for balconies
        const balconies = client.numberOfBalcony || 0;
        totalCost += balconies * 45;

        // Add extras for laundry loads
        const laundryLoads = client.laundryLoads || 0;
        totalCost += laundryLoads * 10;

        // Add extras for selected services (if applicable)
        if (client.selectedServices.includes('Garage Floor')) {
            totalCost += 45;
        }
        if (client.selectedServices.includes('Dishes')) {
            totalCost += 10;
        }

        return totalCost.toString();
    };

    // Recalculate cost whenever relevant fields change
    useEffect(() => {
        if (
            newClient.propertyType === 'Apartment' ||
            newClient.propertyType === 'House'
        ) {
            calculateCost();
        }
    }, [
        newClient.propertyType,
        newClient.cleaningType,
        newClient.numberOfRooms,
        newClient.numberOfBathrooms,
        newClient.numberOfKitchens,
        newClient.numberOfLivingRooms,
        newClient.selectedServices,
        newClient.numberOfWalls, // Add this
        newClient.numberOfWindows, // Add this
        newClient.numberOfBalcony, // Add this
        newClient.laundryLoads, // Add this
    ]);

    // Check if the current user is an admin and fetch clients and workers
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    // Fetch the admin document from Firestore
                    const adminDocRef = doc(db, 'admin', user.uid); // Use the user's UID as the document ID
                    const adminDoc = await getDoc(adminDocRef);

                    if (adminDoc.exists()) {
                        if (adminDoc.data()?.isAdmin) {
                            setIsAdmin(true); // User is an admin
                            // Fetch clients data
                            const clientsCollectionRef = collection(db, 'clients');
                            const clientsSnapshot = await getDocs(clientsCollectionRef);
                            const clientsData = clientsSnapshot.docs.map((doc) => ({
                                id: doc.id, // Use Firestore's auto-generated ID
                                ...doc.data(),
                            })) as Client[]; // Explicitly cast to Client[]
                            setClients(clientsData); // Store clients data in state

                            // Fetch workers data
                            const workersCollectionRef = collection(db, 'workers');
                            const workersSnapshot = await getDocs(workersCollectionRef);
                            const workersData = workersSnapshot.docs.map((doc) => ({
                                id: doc.id,
                                ...doc.data(),
                            })) as Worker[]; // Explicitly cast to Worker[]
                            setWorkers(workersData); // Store workers data in state
                        } else {
                            router.push('/'); // Redirect non-admin users to the home page
                        }
                    } else {
                        router.push('/'); // Redirect if admin document is missing
                    }
                } catch (error) {
                    router.push('/'); // Redirect on error
                }
            } else {
                router.push('/login'); // Redirect unauthenticated users to the login page
            }
            setLoading(false); // Stop loading
        });

        return () => unsubscribe(); // Cleanup subscription
    }, [router]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;

        // Handle checkboxes (only for input elements)
        if (type === 'checkbox') {
            const target = e.target as HTMLInputElement; // Narrow down the type
            setNewClient((prev) => ({
                ...prev,
                [name]: target.checked, // Access `checked` safely
            }));
        } else {
            setNewClient((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    // Handle form submission
    const handleAddClient = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            // Add the new client to Firestore
            const clientsCollectionRef = collection(db, 'clients');

            // Destructure newClient to exclude the `id` field
            const { id, ...clientData } = newClient;

            const docRef = await addDoc(clientsCollectionRef, {
                ...clientData, // Spread the rest of the client data
                createdAt: new Date().toISOString(), // Automatically set the creation date
            });

            console.log('Client added with ID:', docRef.id);

            // Update the clients list
            setClients((prev) => [
                ...prev,
                {
                    id: docRef.id, // Use Firestore's auto-generated ID
                    ...clientData, // Spread the rest of the client data
                },
            ]);

            // Reset the form
            setNewClient({
                id: '',
                name: '',
                email: '',
                phone: '',
                address: '',
                assignedWorkerId: '',
                cleaningType: '',
                cleaningFrequency: '',
                selectedServices: [],
                propertyType: '',
                superficialArea: '',
                numberOfKitchens: '',
                numberOfRooms: '',
                numberOfLivingRooms: '',
                numberOfBathrooms: '',
                numberOfWalls: 0,
                numberOfWindows: 0,
                numberOfBalcony: 0,
                laundryLoads: 0,
                cost: '',
                createdAt: '',
                deadline: '',
                preferredDay: '',
                priority: '',
                status: '',
                title: '',
            });

            // Close the form
            setShowAddClientForm(false);
        } catch (error) {
            console.error('Error adding client:', error);
        }
    };

    // Show loading state while checking admin status
    if (loading) {
        return <div>Loading...</div>;
    }

    // Show "Access Denied" if the user is not an admin
    if (!isAdmin) {
        return <div>Access Denied. You must be an admin to view this page.</div>;
    }

    // Render the clients list and add client form
    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Clients Section
            </h2>

            {/* Add Client Button */}
            <button
                onClick={() => setShowAddClientForm(true)}
                className="mb-6 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
                Add Client
            </button>

            {/* Add Client Form */}
            {showAddClientForm && (
                <form onSubmit={handleAddClient} className="mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Existing fields */}
                        <div className="flex flex-col">
                            <label className="text-sm text-gray-600 mb-1">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={newClient.name}
                                onChange={handleInputChange}
                                className="p-2 border border-gray-300 rounded-lg"
                                required
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm text-gray-600 mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={newClient.email}
                                onChange={handleInputChange}
                                className="p-2 border border-gray-300 rounded-lg"
                                required
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm text-gray-600 mb-1">Phone</label>
                            <input
                                type="tel"
                                name="phone"
                                value={newClient.phone}
                                onChange={handleInputChange}
                                className="p-2 border border-gray-300 rounded-lg"
                                required
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm text-gray-600 mb-1">Address</label>
                            <input
                                type="text"
                                name="address"
                                value={newClient.address}
                                onChange={handleInputChange}
                                className="p-2 border border-gray-300 rounded-lg"
                                required
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm text-gray-600 mb-1">Created At</label>
                            <input
                                type="date"
                                name="createdAt"
                                value={newClient.createdAt}
                                onChange={handleInputChange}
                                className="p-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm text-gray-600 mb-1">Deadline</label>
                            <input
                                type="date"
                                name="deadline"
                                value={newClient.deadline}
                                onChange={handleInputChange}
                                className="p-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                        <div className="flex flex-col w-full">
                            <select
                                name="cleaningFrequency"
                                value={newClient.cleaningFrequency}
                                onChange={handleInputChange}
                                className="p-2 border border-gray-300 rounded-lg"
                            >
                                <option value="">Select Cleaning Frequency</option>
                                <option value="One Time">One Time</option>
                                <option value="Weekly">Weekly</option>
                                <option value="Biweekly">Biweekly</option>
                                <option value="Monthly">Monthly</option>
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <select
                                name="preferredDay"
                                value={newClient.preferredDay}
                                onChange={handleInputChange}
                                className="p-2 border border-gray-300 rounded-lg"
                            >
                                <option value="">Select Preferred Day</option>
                                <option value="Monday">Monday</option>
                                <option value="Tuesday">Tuesday</option>
                                <option value="Wednesday">Wednesday</option>
                                <option value="Thursday">Thursday</option>
                                <option value="Friday">Friday</option>
                                <option value="Saturday">Saturday</option>
                                <option value="Sunday">Sunday</option>
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <select
                                name="assignedWorkerId"
                                value={newClient.assignedWorkerId}
                                onChange={handleInputChange}
                                className="p-2 border border-gray-300 rounded-lg"
                            >
                                <option value="">Select a Worker</option>
                                {workers.map((worker) => (
                                    <option key={worker.id} value={worker.id}>
                                        {worker.name} ({worker.id})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <select
                                name="cleaningType"
                                value={newClient.cleaningType}
                                onChange={handleInputChange}
                                className="p-2 border border-gray-300 rounded-lg"
                            >
                                <option value="">Select Cleaning Type</option>
                                <option value="Light Cleaning">Light Cleaning</option>
                                <option value="Standard Cleaning">Standard Cleaning</option>
                                <option value="Deep Cleaning">Deep Cleaning</option>
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <select
                                name="propertyType"
                                value={newClient.propertyType}
                                onChange={handleInputChange}
                                className="p-2 border border-gray-300 rounded-lg"
                            >
                                <option value="">Select Property Type</option>
                                <option value="Apartment">Apartment</option>
                                <option value="House">House</option>
                                <option value="Office">Office</option>
                                <option value="Commercial">Commercial</option>
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <select
                                name="priority"
                                value={newClient.priority}
                                onChange={handleInputChange}
                                className="p-2 border border-gray-300 rounded-lg"
                            >
                                <option value="">Select Priority</option>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <select
                                name="status"
                                value={newClient.status}
                                onChange={handleInputChange}
                                className="p-2 border border-gray-300 rounded-lg"
                            >
                                <option value="">Select Status</option>
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <select
                                name="superficialArea"
                                value={newClient.superficialArea}
                                onChange={handleInputChange}
                                className="p-2 border border-gray-300 rounded-lg"
                            >
                                <option value="">Select Superficial Area</option>
                                <option value="500-1000 ft²">500-1000 ft²</option>
                                <option value="1000-1500 ft²">1000-1500 ft²</option>
                                <option value="1500-2000 ft²">1500-2000 ft²</option>
                                <option value="2000-2500 ft²">2000-2500 ft²</option>
                                <option value="2500-3000 ft²">2500-3000 ft²</option>
                                <option value="3000-3500 ft²">3000-3500 ft²</option>
                                <option value="3500-4000 ft²">3500-4000 ft²</option>
                                <option value="4000-4500 ft²">4000-4500 ft²</option>
                                <option value="4500-5000 ft²">4500-5000 ft²</option>
                            </select>
                        </div>
                        {/* Conditionally render fields based on propertyType */}
                        {newClient.propertyType !== 'Commercial' &&
                            newClient.propertyType !== 'Office' && (
                                <>
                                    <div className="flex flex-col col-span-2">
                                        <label className="text-sm text-gray-600 mb-1">
                                            Select Services
                                        </label>
                                        <div className="flex flex-col gap-2">
                                            {[
                                                'Inside the Oven',
                                                'Inside the Fridge',
                                                'Inside Windows (how many windows)',
                                                'Walls',
                                                'Balcony / Patio',
                                                'Garage Floor',
                                                'Laundry & Drying',
                                                'Dishes',
                                            ].map((service) => (
                                                <label
                                                    key={service}
                                                    className="flex items-center gap-2"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        name="selectedServices"
                                                        value={service}
                                                        checked={newClient.selectedServices.includes(
                                                            service
                                                        )}
                                                        onChange={(e) => {
                                                            const { value, checked } = e.target;
                                                            setNewClient((prev) => ({
                                                                ...prev,
                                                                selectedServices: checked
                                                                    ? [...prev.selectedServices, value] // Add to array if checked
                                                                    : prev.selectedServices.filter(
                                                                        (item) => item !== value
                                                                    ), // Remove if unchecked
                                                            }));
                                                        }}
                                                        className="border border-gray-300 rounded"
                                                    />
                                                    {service}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-sm text-gray-600 mb-1">
                                            Number of Kitchens
                                        </label>
                                        <input
                                            type="number"
                                            name="numberOfKitchens"
                                            value={newClient.numberOfKitchens}
                                            onChange={handleInputChange}
                                            className="p-2 border border-gray-300 rounded-lg"
                                            min="0"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-sm text-gray-600 mb-1">
                                            Number of Living Rooms
                                        </label>
                                        <input
                                            type="number"
                                            name="numberOfLivingRooms"
                                            value={newClient.numberOfLivingRooms}
                                            onChange={handleInputChange}
                                            className="p-2 border border-gray-300 rounded-lg"
                                            min="0"
                                        />
                                    </div>
                                </>
                            )}
                        <div className="flex flex-col">
                            <label className="text-sm text-gray-600 mb-1">
                                Number of Rooms
                            </label>
                            <input
                                type="number"
                                name="numberOfRooms"
                                value={newClient.numberOfRooms}
                                onChange={handleInputChange}
                                className="p-2 border border-gray-300 rounded-lg"
                                min="0"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm text-gray-600 mb-1">
                                Number of Bathrooms
                            </label>
                            <input
                                type="number"
                                name="numberOfBathrooms"
                                value={newClient.numberOfBathrooms}
                                onChange={handleInputChange}
                                className="p-2 border border-gray-300 rounded-lg"
                                min="0"
                            />
                        </div>
                        {/* Conditionally render fields based on selected services */}
                        {newClient.selectedServices.includes('Walls') && (
                            <div className="flex flex-col">
                                <label className="text-sm text-gray-600 mb-1">
                                    Number of Walls
                                </label>
                                <input
                                    type="number"
                                    name="numberOfWalls"
                                    value={newClient.numberOfWalls}
                                    onChange={handleInputChange}
                                    className="p-2 border border-gray-300 rounded-lg"
                                    min="0"
                                />
                            </div>
                        )}
                        {newClient.selectedServices.includes(
                            'Inside Windows (how many windows)'
                        ) && (
                                <div className="flex flex-col">
                                    <label className="text-sm text-gray-600 mb-1">
                                        Number of Windows
                                    </label>
                                    <input
                                        type="number"
                                        name="numberOfWindows"
                                        value={newClient.numberOfWindows}
                                        onChange={handleInputChange}
                                        className="p-2 border border-gray-300 rounded-lg"
                                        min="0"
                                    />
                                </div>
                            )}
                        {newClient.selectedServices.includes('Balcony / Patio') && (
                            <div className="flex flex-col">
                                <label className="text-sm text-gray-600 mb-1">
                                    Number of Balcony/Patio
                                </label>
                                <input
                                    type="number"
                                    name="numberOfBalcony"
                                    value={newClient.numberOfBalcony}
                                    onChange={handleInputChange}
                                    className="p-2 border border-gray-300 rounded-lg"
                                    min="0"
                                />
                            </div>
                        )}
                        {newClient.selectedServices.includes('Laundry & Drying') && (
                            <div className="flex flex-col">
                                <label className="text-sm text-gray-600 mb-1">
                                    Laundry & Drying (Number of Loads)
                                </label>
                                <input
                                    type="number"
                                    name="laundryLoads"
                                    value={newClient.laundryLoads}
                                    onChange={handleInputChange}
                                    className="p-2 border border-gray-300 rounded-lg"
                                    min="0"
                                />
                            </div>
                        )}
                        <div className="flex flex-col">
                            <label className="text-sm text-gray-600 mb-1">Cost</label>
                            <input
                                type="text"
                                name="cost"
                                value={newClient.cost}
                                onChange={handleInputChange}
                                className="p-2 border border-gray-300 rounded-lg"
                                readOnly // Make the cost field read-only
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm text-gray-600 mb-1">Note</label>
                            <input
                                type="text"
                                name="title"
                                value={newClient.title}
                                onChange={handleInputChange}
                                className="p-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                    </div>
                    <div className="mt-4">
                        <button
                            type="submit"
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                        >
                            Save Client
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowAddClientForm(false)}
                            className="ml-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {/* Clients List */}
            {/* Clients List */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4 border-b text-center">Name</th>
                            <th className="py-2 px-4 border-b text-center">Address</th>
                            <th className="py-2 px-4 border-b text-center">Assigned Worker</th>
                            <th className="py-2 px-4 border-b text-center">Cost</th>
                            <th className="py-2 px-4 border-b text-center">Created At</th>
                            <th className="py-2 px-4 border-b text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map((client) => (
                            <tr
                                key={client.id}
                                className="hover:bg-gray-50 cursor-pointer"
                                onClick={() => setSelectedClient(client)} // Add this line
                            >
                                <td className="py-2 px-4 border-b text-center">{client.name}</td>
                                <td className="py-2 px-4 border-b text-center">{client.address}</td>
                                <td className="py-2 px-4 border-b text-center">
                                    {workers.find((worker) => worker.id === client.assignedWorkerId)?.name || 'N/A'}
                                </td>
                                <td className="py-2 px-4 border-b text-center">{client.cost}</td>
                                <td className="py-2 px-4 border-b text-center">
                                    {formatDateTime(client.createdAt)}
                                </td>
                                <td className="py-2 px-4 border-b text-center">
                                    <button
                                        onClick={async (e) => {
                                            e.stopPropagation(); // Prevent the row click event from firing
                                            if (window.confirm('Are you sure you want to delete this client?')) {
                                                try {
                                                    await deleteDoc(doc(db, 'clients', client.id));
                                                    setClients((prevClients) =>
                                                        prevClients.filter((c) => c.id !== client.id)
                                                    );
                                                    alert('Client deleted successfully!');
                                                } catch (error) {
                                                    console.error('Error deleting client:', error);
                                                    alert('Failed to delete client.');
                                                }
                                            }
                                        }}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        <FaTrash className="inline-block" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedClient && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full overflow-y-auto max-h-screen">
                        <h2 className="text-xl font-semibold mb-4">
                            {isEditMode ? 'Edit Client' : 'Client Details'}
                        </h2>

                        {/* Edit Button */}
                        <button
                            onClick={() => setIsEditMode(!isEditMode)}
                            className="mb-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                            {isEditMode ? 'Cancel Edit' : 'Edit'}
                        </button>

                        {/* Client Details or Edit Form */}
                        {isEditMode ? (
                            <form
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    try {
                                        // Convert selectedClient to a plain object and remove undefined values
                                        const clientData = Object.fromEntries(
                                            Object.entries(selectedClient).filter(
                                                ([_, value]) => value !== undefined
                                            )
                                        );

                                        // Update the client in Firestore
                                        const clientRef = doc(db, 'clients', selectedClient.id);
                                        await updateDoc(clientRef, clientData);

                                        // Refresh the clients list
                                        const clientsSnapshot = await getDocs(
                                            collection(db, 'clients')
                                        );
                                        const clientsData = clientsSnapshot.docs.map((doc) => ({
                                            id: doc.id,
                                            ...doc.data(),
                                        })) as Client[];
                                        setClients(clientsData);

                                        // Exit edit mode
                                        setIsEditMode(false);
                                        alert('Client updated successfully!');
                                    } catch (error) {
                                        console.error('Error updating client:', error);
                                        alert('Failed to update client.');
                                    }
                                }}
                            >
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Editable Fields */}
                                    <div>
                                        <label>Name</label>
                                        <input
                                            type="text"
                                            value={selectedClient.name}
                                            onChange={(e) =>
                                                setSelectedClient({
                                                    ...selectedClient,
                                                    name: e.target.value,
                                                })
                                            }
                                            className="p-2 border border-gray-300 rounded-lg w-full"
                                        />
                                    </div>
                                    <div>
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            value={selectedClient.email}
                                            onChange={(e) =>
                                                setSelectedClient({
                                                    ...selectedClient,
                                                    email: e.target.value,
                                                })
                                            }
                                            className="p-2 border border-gray-300 rounded-lg w-full"
                                        />
                                    </div>
                                    <div>
                                        <label>Phone</label>
                                        <input
                                            type="tel"
                                            value={selectedClient.phone}
                                            onChange={(e) =>
                                                setSelectedClient({
                                                    ...selectedClient,
                                                    phone: e.target.value,
                                                })
                                            }
                                            className="p-2 border border-gray-300 rounded-lg w-full"
                                        />
                                    </div>
                                    <div>
                                        <label>Address</label>
                                        <input
                                            type="text"
                                            value={selectedClient.address}
                                            onChange={(e) =>
                                                setSelectedClient({
                                                    ...selectedClient,
                                                    address: e.target.value,
                                                })
                                            }
                                            className="p-2 border border-gray-300 rounded-lg w-full"
                                        />
                                    </div>
                                    <div>
                                        <label>Assigned Worker ID</label>
                                        <input
                                            type="text"
                                            value={selectedClient.assignedWorkerId}
                                            onChange={(e) =>
                                                setSelectedClient({
                                                    ...selectedClient,
                                                    assignedWorkerId: e.target.value,
                                                })
                                            }
                                            className="p-2 border border-gray-300 rounded-lg w-full"
                                        />
                                    </div>
                                    <div>
                                        <label>Cleaning Type</label>
                                        <select
                                            value={selectedClient.cleaningType}
                                            onChange={(e) => {
                                                const updatedClient = {
                                                    ...selectedClient,
                                                    cleaningType: e.target.value,
                                                };
                                                const updatedCost = recalculateCost(updatedClient);
                                                setSelectedClient({
                                                    ...updatedClient,
                                                    cost: updatedCost,
                                                });
                                            }}
                                            className="p-2 border border-gray-300 rounded-lg w-full"
                                        >
                                            <option value="Light Cleaning">Light Cleaning</option>
                                            <option value="Standard Cleaning">
                                                Standard Cleaning
                                            </option>
                                            <option value="Deep Cleaning">Deep Cleaning</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label>Cleaning Frequency</label>
                                        <select
                                            value={selectedClient.cleaningFrequency}
                                            onChange={(e) =>
                                                setSelectedClient({
                                                    ...selectedClient,
                                                    cleaningFrequency: e.target.value,
                                                })
                                            }
                                            className="p-2 border border-gray-300 rounded-lg w-full"
                                        >
                                            <option value="One Time">One Time</option>
                                            <option value="Weekly">Weekly</option>
                                            <option value="Biweekly">Biweekly</option>
                                            <option value="Monthly">Monthly</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label>Selected Services</label>
                                        <div className="flex flex-col gap-2">
                                            {availableServices.map((service) => (
                                                <label
                                                    key={service}
                                                    className="flex items-center gap-2"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedClient.selectedServices.includes(
                                                            service
                                                        )}
                                                        onChange={(e) => {
                                                            const updatedServices = e.target.checked
                                                                ? [...selectedClient.selectedServices, service] // Add service if checked
                                                                : selectedClient.selectedServices.filter(
                                                                    (s) => s !== service
                                                                ); // Remove service if unchecked

                                                            const updatedClient = {
                                                                ...selectedClient,
                                                                selectedServices: updatedServices,
                                                            };
                                                            const updatedCost =
                                                                recalculateCost(updatedClient);
                                                            setSelectedClient({
                                                                ...updatedClient,
                                                                cost: updatedCost,
                                                            });
                                                        }}
                                                        className="border border-gray-300 rounded"
                                                    />
                                                    {service}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label>Property Type</label>
                                        <select
                                            value={selectedClient.propertyType}
                                            onChange={(e) => {
                                                const updatedClient = {
                                                    ...selectedClient,
                                                    propertyType: e.target.value,
                                                };
                                                const updatedCost = recalculateCost(updatedClient);
                                                setSelectedClient({
                                                    ...updatedClient,
                                                    cost: updatedCost,
                                                });
                                            }}
                                            className="p-2 border border-gray-300 rounded-lg w-full"
                                        >
                                            <option value="Apartment">Apartment</option>
                                            <option value="House">House</option>
                                            <option value="Office">Office</option>
                                            <option value="Commercial">Commercial</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label>Superficial Area</label>
                                        <select
                                            value={selectedClient.superficialArea}
                                            onChange={(e) =>
                                                setSelectedClient({
                                                    ...selectedClient,
                                                    superficialArea: e.target.value,
                                                })
                                            }
                                            className="p-2 border border-gray-300 rounded-lg w-full"
                                        >
                                            <option value="">Select Superficial Area</option>
                                            {superficialAreaOptions.map((area) => (
                                                <option key={area} value={area}>
                                                    {area}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label>Number of Kitchens</label>
                                        <input
                                            type="number"
                                            value={selectedClient.numberOfKitchens}
                                            onChange={(e) => {
                                                const updatedClient = {
                                                    ...selectedClient,
                                                    numberOfKitchens: e.target.value,
                                                };
                                                const updatedCost = recalculateCost(updatedClient);
                                                setSelectedClient({
                                                    ...updatedClient,
                                                    cost: updatedCost,
                                                });
                                            }}
                                            className="p-2 border border-gray-300 rounded-lg w-full"
                                        />
                                    </div>
                                    <div>
                                        <label>Number of Rooms</label>
                                        <input
                                            type="number"
                                            value={selectedClient.numberOfRooms}
                                            onChange={(e) => {
                                                const updatedClient = {
                                                    ...selectedClient,
                                                    numberOfRooms: e.target.value,
                                                };
                                                const updatedCost = recalculateCost(updatedClient);
                                                setSelectedClient({
                                                    ...updatedClient,
                                                    cost: updatedCost,
                                                });
                                            }}
                                            className="p-2 border border-gray-300 rounded-lg w-full"
                                        />
                                    </div>
                                    <div>
                                        <label>Number of Living Rooms</label>
                                        <input
                                            type="number"
                                            value={selectedClient.numberOfLivingRooms}
                                            onChange={(e) => {
                                                const updatedClient = {
                                                    ...selectedClient,
                                                    numberOfLivingRooms: e.target.value,
                                                };
                                                const updatedCost = recalculateCost(updatedClient);
                                                setSelectedClient({
                                                    ...updatedClient,
                                                    cost: updatedCost,
                                                });
                                            }}
                                            className="p-2 border border-gray-300 rounded-lg w-full"
                                        />
                                    </div>
                                    <div>
                                        <label>Number of Bathrooms</label>
                                        <input
                                            type="number"
                                            value={selectedClient.numberOfBathrooms}
                                            onChange={(e) => {
                                                const updatedClient = {
                                                    ...selectedClient,
                                                    numberOfBathrooms: e.target.value,
                                                };
                                                const updatedCost = recalculateCost(updatedClient);
                                                setSelectedClient({
                                                    ...updatedClient,
                                                    cost: updatedCost,
                                                });
                                            }}
                                            className="p-2 border border-gray-300 rounded-lg w-full"
                                        />
                                    </div>
                                    <div>
                                        <label>Number of Walls</label>
                                        <input
                                            type="number"
                                            value={selectedClient.numberOfWalls}
                                            onChange={(e) => {
                                                const updatedClient = {
                                                    ...selectedClient,
                                                    numberOfWalls: parseInt(e.target.value) || 0,
                                                };
                                                const updatedCost = recalculateCost(updatedClient);
                                                setSelectedClient({
                                                    ...updatedClient,
                                                    cost: updatedCost,
                                                });
                                            }}
                                            className="p-2 border border-gray-300 rounded-lg w-full"
                                        />
                                    </div>
                                    <div>
                                        <label>Number of Windows</label>
                                        <input
                                            type="number"
                                            value={selectedClient.numberOfWindows}
                                            onChange={(e) => {
                                                const updatedClient = {
                                                    ...selectedClient,
                                                    numberOfWindows: parseInt(e.target.value) || 0,
                                                };
                                                const updatedCost = recalculateCost(updatedClient);
                                                setSelectedClient({
                                                    ...updatedClient,
                                                    cost: updatedCost,
                                                });
                                            }}
                                            className="p-2 border border-gray-300 rounded-lg w-full"
                                        />
                                    </div>
                                    <div>
                                        <label>Number of Balcony/Patio</label>
                                        <input
                                            type="number"
                                            value={selectedClient.numberOfBalcony}
                                            onChange={(e) => {
                                                const updatedClient = {
                                                    ...selectedClient,
                                                    numberOfBalcony: parseInt(e.target.value) || 0,
                                                };
                                                const updatedCost = recalculateCost(updatedClient);
                                                setSelectedClient({
                                                    ...updatedClient,
                                                    cost: updatedCost,
                                                });
                                            }}
                                            className="p-2 border border-gray-300 rounded-lg w-full"
                                        />
                                    </div>
                                    <div>
                                        <label>Laundry Loads</label>
                                        <input
                                            type="number"
                                            value={selectedClient.laundryLoads}
                                            onChange={(e) => {
                                                const updatedClient = {
                                                    ...selectedClient,
                                                    laundryLoads: parseInt(e.target.value) || 0,
                                                };
                                                const updatedCost = recalculateCost(updatedClient);
                                                setSelectedClient({
                                                    ...updatedClient,
                                                    cost: updatedCost,
                                                });
                                            }}
                                            className="p-2 border border-gray-300 rounded-lg w-full"
                                        />
                                    </div>

                                    <div>
                                        <label>Created At</label>
                                        <input
                                            type="date"
                                            value={selectedClient.createdAt}
                                            onChange={(e) =>
                                                setSelectedClient({
                                                    ...selectedClient,
                                                    createdAt: e.target.value,
                                                })
                                            }
                                            className="p-2 border border-gray-300 rounded-lg w-full"
                                        />
                                    </div>
                                    <div>
                                        <label>Deadline</label>
                                        <input
                                            type="date"
                                            value={selectedClient.deadline}
                                            onChange={(e) =>
                                                setSelectedClient({
                                                    ...selectedClient,
                                                    deadline: e.target.value,
                                                })
                                            }
                                            className="p-2 border border-gray-300 rounded-lg w-full"
                                        />
                                    </div>
                                    <div>
                                        <label>Preferred Day</label>
                                        <select
                                            value={selectedClient.preferredDay}
                                            onChange={(e) =>
                                                setSelectedClient({
                                                    ...selectedClient,
                                                    preferredDay: e.target.value,
                                                })
                                            }
                                            className="p-2 border border-gray-300 rounded-lg w-full"
                                        >
                                            <option value="Monday">Monday</option>
                                            <option value="Tuesday">Tuesday</option>
                                            <option value="Wednesday">Wednesday</option>
                                            <option value="Thursday">Thursday</option>
                                            <option value="Friday">Friday</option>
                                            <option value="Saturday">Saturday</option>
                                            <option value="Sunday">Sunday</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label>Priority</label>
                                        <select
                                            value={selectedClient.priority}
                                            onChange={(e) =>
                                                setSelectedClient({
                                                    ...selectedClient,
                                                    priority: e.target.value,
                                                })
                                            }
                                            className="p-2 border border-gray-300 rounded-lg w-full"
                                        >
                                            <option value="Low">Low</option>
                                            <option value="Medium">Medium</option>
                                            <option value="High">High</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label>Status</label>
                                        <select
                                            value={selectedClient.status}
                                            onChange={(e) =>
                                                setSelectedClient({
                                                    ...selectedClient,
                                                    status: e.target.value,
                                                })
                                            }
                                            className="p-2 border border-gray-300 rounded-lg w-full"
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label>Cost</label>
                                        <input
                                            type="text"
                                            value={selectedClient.cost}
                                            readOnly // Make the cost field read-only
                                            className="p-2 border border-gray-300 rounded-lg w-full bg-gray-100"
                                        />
                                    </div>
                                    <div>
                                        <label>Title</label>
                                        <input
                                            type="text"
                                            value={selectedClient.title}
                                            onChange={(e) =>
                                                setSelectedClient({
                                                    ...selectedClient,
                                                    title: e.target.value,
                                                })
                                            }
                                            className="p-2 border border-gray-300 rounded-lg w-full"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                                >
                                    Save Changes
                                </button>
                            </form>
                        ) : (
                            <div className="grid grid-cols-2 gap-4">
                                {/* Display Client Details (Read-Only) */}
                                <div>
                                    <p>
                                        <strong>Name:</strong> {selectedClient.name}
                                    </p>
                                    <p>
                                        <strong>Email:</strong> {selectedClient.email}
                                    </p>
                                    <p>
                                        <strong>Phone:</strong> {selectedClient.phone}
                                    </p>
                                    <p>
                                        <strong>Address:</strong> {selectedClient.address}
                                    </p>
                                    <p>
                                        <strong>Assigned Worker:</strong>{' '}
                                        {workers.find(
                                            (worker) => worker.id === selectedClient.assignedWorkerId
                                        )?.name || 'N/A'}
                                    </p>
                                    <p>
                                        <strong>Cleaning Type:</strong>{' '}
                                        {selectedClient.cleaningType}
                                    </p>
                                    <p>
                                        <strong>Cleaning Frequency:</strong>{' '}
                                        {selectedClient.cleaningFrequency}
                                    </p>
                                    <p>
                                        <strong>Selected Services:</strong>{' '}
                                        {selectedClient.selectedServices.join(', ')}
                                    </p>
                                </div>
                                <div>
                                    <p>
                                        <strong>Property Type:</strong>{' '}
                                        {selectedClient.propertyType}
                                    </p>
                                    <p>
                                        <strong>Superficial Area:</strong>{' '}
                                        {selectedClient.superficialArea}
                                    </p>
                                    <p>
                                        <strong>Number of Kitchens:</strong>{' '}
                                        {selectedClient.numberOfKitchens}
                                    </p>
                                    <p>
                                        <strong>Number of Rooms:</strong>{' '}
                                        {selectedClient.numberOfRooms}
                                    </p>
                                    <p>
                                        <strong>Number of Living Rooms:</strong>{' '}
                                        {selectedClient.numberOfLivingRooms}
                                    </p>
                                    <p>
                                        <strong>Number of Bathrooms:</strong>{' '}
                                        {selectedClient.numberOfBathrooms}
                                    </p>
                                    <p>
                                        <strong>Number of Walls:</strong>{' '}
                                        {selectedClient.numberOfWalls}
                                    </p>
                                    <p>
                                        <strong>Number of Windows:</strong>{' '}
                                        {selectedClient.numberOfWindows}
                                    </p>
                                    <p>
                                        <strong>Number of Balcony/Patio:</strong>{' '}
                                        {selectedClient.numberOfBalcony}
                                    </p>
                                    <p>
                                        <strong>Laundry Loads:</strong>{' '}
                                        {selectedClient.laundryLoads}
                                    </p>
                                    <p>
                                        <strong>Cost:</strong> {selectedClient.cost}
                                    </p>
                                    <p>
                                        <strong>Created At:</strong> {selectedClient.createdAt}
                                    </p>
                                    <p>
                                        <strong>Deadline:</strong> {selectedClient.deadline}
                                    </p>
                                    <p>
                                        <strong>Preferred Day:</strong>{' '}
                                        {selectedClient.preferredDay}
                                    </p>
                                    <p>
                                        <strong>Priority:</strong> {selectedClient.priority}
                                    </p>
                                    <p>
                                        <strong>Status:</strong> {selectedClient.status}
                                    </p>
                                    <p>
                                        <strong>Title:</strong> {selectedClient.title}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Close Button */}
                        <button
                            onClick={() => {
                                setSelectedClient(null);
                                setIsEditMode(false); // Reset edit mode when closing the modal
                            }}
                            className="mt-4 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Clients;
