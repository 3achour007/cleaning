'use client';

import { useEffect, useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    LineChart,
    Line,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts';
import {
    CheckCircleIcon,
    ClockIcon,
    CurrencyDollarIcon,
    UsersIcon,
    ArrowUpIcon,
    ArrowDownIcon,
} from '@heroicons/react/24/outline';
import { db } from '@/firebase'; // Adjust the import path
import { collection, query, getDocs } from 'firebase/firestore';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

type ReferralSource = {
    name: string;
    value: number;
};

interface WorkersMap {
    [key: string]: string; // Worker ID -> Worker Name
}

interface RevenueByWorker {
    [key: string]: number; // Worker ID -> Revenue
}
interface WorkerRevenue {
    name: string;
    revenue: number;
  }
  interface ServiceData {
    service: string;
    count: number;
    type: string; // 'service' or 'propertyType'
  }
  
const DashboardContent = () => {
    const [topReferralSources, setTopReferralSources] = useState<ReferralSource[]>([]);
    const [revenueData, setRevenueData] = useState({
        dailyRevenue: 0,
        weeklyRevenue: 0,
        monthlyRevenue: 0,
        dailyPercentageChange: 0,
        weeklyPercentageChange: 0,
        monthlyPercentageChange: 0,
    });
    const [topServicesData, setTopServicesData] = useState<ServiceData[]>([]);
    const [topWorkersData, setTopWorkersData] = useState<WorkerRevenue[]>([]);

    // State for dynamic metrics
    const [todaysSchedule, setTodaysSchedule] = useState(0);
    const [upcomingAppointments, setUpcomingAppointments] = useState(0);
    const [activeJobs, setActiveJobs] = useState(0);
    const [completedJobs, setCompletedJobs] = useState(0);


    // Helper function to calculate percentage change
    const calculatePercentageChange = (current: number, previous: number): number => {
        if (previous === 0) {
            return 100; // If there was no revenue previously, consider it a 100% increase
        }
        return ((current - previous) / previous) * 100;
    };

    // Fetch referral sources from Firestore
    useEffect(() => {
        const fetchReferralSources = async () => {
            try {
                const clientsRef = collection(db, 'clients');
                const q = query(clientsRef);
                const querySnapshot = await getDocs(q);

                // Count references
                const referenceCounts: Record<string, number> = {}; // Explicitly define the type
                querySnapshot.forEach((doc) => {
                    const reference = doc.data().reference;
                    if (reference) {
                        referenceCounts[reference] = (referenceCounts[reference] || 0) + 1;
                    }
                });

                // Format data for the PieChart
                const formattedData = Object.keys(referenceCounts).map((name) => ({
                    name,
                    value: referenceCounts[name],
                }));

                setTopReferralSources(formattedData);
            } catch (error) {
                console.error('Error fetching referral sources:', error);
            }
        };

        fetchReferralSources();
    }, []);

    // Fetch top revenue by worker
    useEffect(() => {
        const fetchTopRevenueByWorker = async () => {
          try {
            // Fetch workers data
            const workersRef = collection(db, 'workers');
            const workersQuery = query(workersRef);
            const workersSnapshot = await getDocs(workersQuery);
      
            // Create a map of workerId to worker name
            const workersMap: WorkersMap = {}; // Use the interface
            workersSnapshot.forEach((doc) => {
              const workerData = doc.data();
              workersMap[doc.id] = workerData.name; // Assuming 'name' is the field for the worker's name
            });
      
            // Fetch clients data
            const clientsRef = collection(db, 'clients');
            const clientsQuery = query(clientsRef);
            const clientsSnapshot = await getDocs(clientsQuery);
      
            // Aggregate revenue by worker
            const revenueByWorker: RevenueByWorker = {}; // Use the interface
            clientsSnapshot.forEach((doc) => {
              const clientData = doc.data();
              const assignedWorkerId = clientData.assignedWorkerId;
              const cost = parseFloat(clientData.cost);
      
              // Skip if cost is invalid or workerId is missing
              if (isNaN(cost) || cost <= 0 || !assignedWorkerId) {
                return;
              }
      
              // Add revenue to the worker's total
              if (!revenueByWorker[assignedWorkerId]) {
                revenueByWorker[assignedWorkerId] = 0;
              }
              revenueByWorker[assignedWorkerId] += cost;
            });
      
            // Format data for display
            const formattedData = Object.keys(revenueByWorker).map((workerId) => ({
              name: workersMap[workerId] || 'Unknown Worker', // Use worker's name or fallback
              revenue: revenueByWorker[workerId],
            }));
      
            // Sort by revenue (descending) and take the top 5
            const sortedData = formattedData.sort((a, b) => b.revenue - a.revenue).slice(0, 5);
      
            // Update state
            setTopWorkersData(sortedData);
          } catch (error) {
            console.error('Error fetching top revenue by worker:', error);
          }
        };
      
        fetchTopRevenueByWorker();
      }, []);

    // Fetch revenue data from Firestore
    useEffect(() => {
        const fetchRevenueData = async () => {
            try {
                const clientsRef = collection(db, 'clients'); // Use 'clients' collection
                const q = query(clientsRef);
                const querySnapshot = await getDocs(q);

                let dailyRevenue = 0;
                let weeklyRevenue = 0;
                let monthlyRevenue = 0;

                let yesterdayRevenue = 0;
                let lastWeekRevenue = 0;
                let lastMonthRevenue = 0;

                const today = new Date();
                const startOfDay = new Date(today.setHours(0, 0, 0, 0));
                const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
                const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

                // Calculate start of yesterday, last week, and last month
                const startOfYesterday = new Date(startOfDay);
                startOfYesterday.setDate(startOfDay.getDate() - 1);

                const startOfLastWeek = new Date(startOfWeek);
                startOfLastWeek.setDate(startOfWeek.getDate() - 7);

                const startOfLastMonth = new Date(startOfMonth);
                startOfLastMonth.setMonth(startOfMonth.getMonth() - 1);

                console.log('Fetched clients:', querySnapshot.size);

                querySnapshot.forEach((doc) => {
                    const clientData = doc.data();
                    console.log('Client data:', clientData);

                    // Skip if createdAt is missing or empty
                    if (!clientData.createdAt || typeof clientData.createdAt !== 'string') {
                        console.error('Invalid createdAt field:', clientData.createdAt);
                        return;
                    }

                    // Convert createdAt string to a Date object
                    const createdAt = new Date(clientData.createdAt);

                    // Skip if createdAt is invalid
                    if (isNaN(createdAt.getTime())) {
                        console.error('Invalid createdAt field:', clientData.createdAt);
                        return;
                    }

                    // Skip if cost is missing or invalid
                    const cost = parseFloat(clientData.cost);
                    if (isNaN(cost) || cost <= 0) {
                        console.error('Invalid cost field:', clientData.cost);
                        return;
                    }

                    // Skip if status is not "Completed"
                    if (clientData.status !== 'Completed') {
                        console.log('Skipping client with status:', clientData.status);
                        return;
                    }

                    // Calculate daily revenue
                    if (createdAt >= startOfDay) {
                        dailyRevenue += cost;
                    }

                    // Calculate yesterday's revenue
                    if (createdAt >= startOfYesterday && createdAt < startOfDay) {
                        yesterdayRevenue += cost;
                    }

                    // Calculate weekly revenue
                    if (createdAt >= startOfWeek) {
                        weeklyRevenue += cost;
                    }

                    // Calculate last week's revenue
                    if (createdAt >= startOfLastWeek && createdAt < startOfWeek) {
                        lastWeekRevenue += cost;
                    }

                    // Calculate monthly revenue
                    if (createdAt >= startOfMonth) {
                        monthlyRevenue += cost;
                    }

                    // Calculate last month's revenue
                    if (createdAt >= startOfLastMonth && createdAt < startOfMonth) {
                        lastMonthRevenue += cost;
                    }
                });

                // Calculate percentage changes
                const dailyPercentageChange = calculatePercentageChange(dailyRevenue, yesterdayRevenue);
                const weeklyPercentageChange = calculatePercentageChange(weeklyRevenue, lastWeekRevenue);
                const monthlyPercentageChange = calculatePercentageChange(monthlyRevenue, lastMonthRevenue);

                console.log('Daily Revenue:', dailyRevenue);
                console.log('Yesterday Revenue:', yesterdayRevenue);
                console.log('Daily Percentage Change:', dailyPercentageChange);

                console.log('Weekly Revenue:', weeklyRevenue);
                console.log('Last Week Revenue:', lastWeekRevenue);
                console.log('Weekly Percentage Change:', weeklyPercentageChange);

                console.log('Monthly Revenue:', monthlyRevenue);
                console.log('Last Month Revenue:', lastMonthRevenue);
                console.log('Monthly Percentage Change:', monthlyPercentageChange);

                setRevenueData({
                    dailyRevenue,
                    weeklyRevenue,
                    monthlyRevenue,
                    dailyPercentageChange,
                    weeklyPercentageChange,
                    monthlyPercentageChange,
                });
            } catch (error) {
                console.error('Error fetching revenue data:', error);
            }
        };

        fetchRevenueData();
    }, []);

    // Fetch top services data from Firestore
    useEffect(() => {
        const fetchTopServices = async () => {
          try {
            const clientsRef = collection(db, 'clients');
            const q = query(clientsRef);
            const querySnapshot = await getDocs(q);
      
            // Aggregate selectedServices and propertyType
            const serviceCounts: Record<string, number> = {}; // Explicitly define the type
            const propertyTypeCounts: Record<string, number> = {}; // Explicitly define the type
      
            querySnapshot.forEach((doc) => {
              const clientData = doc.data();
      
              // Count selectedServices
              if (clientData.selectedServices && Array.isArray(clientData.selectedServices)) {
                clientData.selectedServices.forEach((service) => {
                  serviceCounts[service] = (serviceCounts[service] || 0) + 1;
                });
              }
      
              // Count propertyType
              if (clientData.propertyType) {
                propertyTypeCounts[clientData.propertyType] = (propertyTypeCounts[clientData.propertyType] || 0) + 1;
              }
            });
      
            // Format data for top services
            const formattedServices = Object.keys(serviceCounts).map((service) => ({
              service,
              count: serviceCounts[service],
              type: 'service', // Add type to distinguish between services and property types
            }));
      
            // Format data for top property types
            const formattedPropertyTypes = Object.keys(propertyTypeCounts).map((propertyType) => ({
              service: propertyType, // Use 'service' key for consistency
              count: propertyTypeCounts[propertyType],
              type: 'propertyType', // Add type to distinguish between services and property types
            }));
      
            // Combine and sort by count (descending)
            const combinedData = [...formattedServices, ...formattedPropertyTypes]
              .sort((a, b) => b.count - a.count)
              .slice(0, 5); // Take the top 5
      
            setTopServicesData(combinedData);
          } catch (error) {
            console.error('Error fetching top services:', error);
          }
        };
      
        fetchTopServices();
      }, []);

    // Fetch dynamic metrics (Today's Schedule, Upcoming Appointments, Active Jobs, Completed Jobs)
    useEffect(() => {
        const fetchJobMetrics = async () => {
            try {
                const clientsRef = collection(db, 'clients');
                const q = query(clientsRef);
                const querySnapshot = await getDocs(q);

                // Initialize counters
                let todaysScheduleCount = 0;
                let upcomingAppointmentsCount = 0;
                let activeJobsCount = 0;
                let completedJobsCount = 0;

                const today = new Date();
                const startOfToday = new Date(today.setHours(0, 0, 0, 0)); // Start of today
                const endOfToday = new Date(today.setHours(23, 59, 59, 999)); // End of today

                querySnapshot.forEach((doc) => {
                    const clientData = doc.data();
                    const createdAt = new Date(clientData.createdAt);
                    const status = clientData.status;

                    // Today's Schedule: Jobs created today
                    if (createdAt >= startOfToday && createdAt <= endOfToday) {
                        todaysScheduleCount++;
                    }

                    // Upcoming Appointments: Jobs with a deadline in the future
                    if (clientData.deadline) {
                        const deadline = new Date(clientData.deadline);
                        if (deadline > today) {
                            upcomingAppointmentsCount++;
                        }
                    }

                    // Active Jobs: Jobs with status "In Progress"
                    if (status === 'In Progress') {
                        activeJobsCount++;
                    }

                    // Completed Jobs: Jobs with status "Completed"
                    if (status === 'Completed') {
                        completedJobsCount++;
                    }
                });

                // Update state with the counts
                setTodaysSchedule(todaysScheduleCount);
                setUpcomingAppointments(upcomingAppointmentsCount);
                setActiveJobs(activeJobsCount);
                setCompletedJobs(completedJobsCount);
            } catch (error) {
                console.error('Error fetching job metrics:', error);
            }
        };

        fetchJobMetrics();
    }, []);

    // Dummy data for other sections
    const averageJobDurations = [
        { name: 'Apartment Cleaning', duration: 2.5 },
        { name: 'Carpet Cleaning', duration: 3.0 },
        { name: 'Window Cleaning', duration: 1.5 },
        { name: 'Deep Cleaning', duration: 4.0 },
        { name: 'Office Cleaning', duration: 2.0 },
    ];

    const topQuebecCities = [
        { name: 'Montreal', efficiency: 95 },
        { name: 'Quebec City', efficiency: 92 },
        { name: 'Laval', efficiency: 90 },
        { name: 'Gatineau', efficiency: 88 },
        { name: 'Longueuil', efficiency: 85 },
    ];

    const workersAverage = [
        { name: 'John Doe', averageTime: 2.5 },
        { name: 'Jane Smith', averageTime: 2.0 },
        { name: 'Mike Johnson', averageTime: 2.3 },
        { name: 'Emily Davis', averageTime: 2.1 },
        { name: 'Chris Brown', averageTime: 2.4 },
    ];

    return (
        <div className="flex-1 p-4 md:p-8">
            {/* Top Metrics Section */}
            <section id="top-metrics" className="mb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Today's Schedule */}
                    <div className="bg-gradient-to-r from-green-100 to-green-200 p-4 rounded-lg shadow-md flex items-center space-x-4">
                        <div className="p-2 bg-green-200 rounded-full">
                            <CheckCircleIcon className="h-6 w-6 text-green-700" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-700">Today's Schedule</p>
                            <p className="text-xl font-bold text-gray-800">{todaysSchedule} Bookings</p>
                        </div>
                    </div>

                    {/* Upcoming Appointments */}
                    <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 p-4 rounded-lg shadow-md flex items-center space-x-4">
                        <div className="p-2 bg-yellow-200 rounded-full">
                            <ClockIcon className="h-6 w-6 text-yellow-700" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-700">Upcoming Appointments</p>
                            <p className="text-xl font-bold text-gray-800">{upcomingAppointments} Bookings</p>
                        </div>
                    </div>

                    {/* Active Jobs */}
                    <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-4 rounded-lg shadow-md flex items-center space-x-4">
                        <div className="p-2 bg-blue-200 rounded-full">
                            <UsersIcon className="h-6 w-6 text-blue-700" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-700">Active Jobs</p>
                            <p className="text-xl font-bold text-gray-800">{activeJobs} In Progress</p>
                        </div>
                    </div>

                    {/* Completed Jobs */}
                    <div className="bg-gradient-to-r from-purple-100 to-purple-200 p-4 rounded-lg shadow-md flex items-center space-x-4">
                        <div className="p-2 bg-purple-200 rounded-full">
                            <CurrencyDollarIcon className="h-6 w-6 text-purple-700" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-700">Completed Jobs</p>
                            <p className="text-xl font-bold text-gray-800">{completedJobs} Completed</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Revenue Overview Section */}
            <section id="revenue-overview" className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Daily Revenue Progress */}
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">
                            Revenue Overview
                        </h3>

                        {/* Daily Revenue */}
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="flex-1">
                                <p className="text-sm text-gray-600">Today's Revenue</p>
                                <p className="text-xl font-bold text-gray-800">${revenueData.dailyRevenue}</p>
                                <div className="flex items-center space-x-2 mt-2">
                                    {revenueData.dailyPercentageChange > 0 ? (
                                        <ArrowUpIcon className="h-4 w-4 text-green-600" />
                                    ) : (
                                        <ArrowDownIcon className="h-4 w-4 text-red-600" />
                                    )}
                                    <p
                                        className={`text-sm ${revenueData.dailyPercentageChange > 0
                                                ? 'text-green-600'
                                                : 'text-red-600'
                                            }`}
                                    >
                                        {Math.abs(revenueData.dailyPercentageChange).toFixed(2)}% compared to yesterday
                                    </p>
                                </div>
                            </div>
                            {/* Progress Bar */}
                            <div className="w-1/3 bg-gray-200 rounded-full h-2.5">
                                <div
                                    className="bg-blue-600 h-2.5 rounded-full"
                                    style={{
                                        width: `${Math.abs(revenueData.dailyPercentageChange)}%`,
                                    }}
                                ></div>
                            </div>
                        </div>

                        {/* Weekly Revenue */}
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="flex-1">
                                <p className="text-sm text-gray-600">Weekly Revenue</p>
                                <p className="text-xl font-bold text-gray-800">${revenueData.weeklyRevenue}</p>
                                <div className="flex items-center space-x-2 mt-2">
                                    {revenueData.weeklyPercentageChange > 0 ? (
                                        <ArrowUpIcon className="h-4 w-4 text-green-600" />
                                    ) : (
                                        <ArrowDownIcon className="h-4 w-4 text-red-600" />
                                    )}
                                    <p
                                        className={`text-sm ${revenueData.weeklyPercentageChange > 0
                                                ? 'text-green-600'
                                                : 'text-red-600'
                                            }`}
                                    >
                                        {Math.abs(revenueData.weeklyPercentageChange).toFixed(2)}% compared to last week
                                    </p>
                                </div>
                            </div>
                            {/* Progress Bar */}
                            <div className="w-1/3 bg-gray-200 rounded-full h-2.5">
                                <div
                                    className="bg-blue-600 h-2.5 rounded-full"
                                    style={{
                                        width: `${Math.abs(revenueData.weeklyPercentageChange)}%`,
                                    }}
                                ></div>
                            </div>
                        </div>

                        {/* Monthly Revenue */}
                        <div className="flex items-center space-x-4">
                            <div className="flex-1">
                                <p className="text-sm text-gray-600">Monthly Revenue</p>
                                <p className="text-xl font-bold text-gray-800">${revenueData.monthlyRevenue}</p>
                                <div className="flex items-center space-x-2 mt-2">
                                    {revenueData.monthlyPercentageChange > 0 ? (
                                        <ArrowUpIcon className="h-4 w-4 text-green-600" />
                                    ) : (
                                        <ArrowDownIcon className="h-4 w-4 text-red-600" />
                                    )}
                                    <p
                                        className={`text-sm ${revenueData.monthlyPercentageChange > 0
                                                ? 'text-green-600'
                                                : 'text-red-600'
                                            }`}
                                    >
                                        {Math.abs(revenueData.monthlyPercentageChange).toFixed(2)}% compared to last month
                                    </p>
                                </div>
                            </div>
                            {/* Progress Bar */}
                            <div className="w-1/3 bg-gray-200 rounded-full h-2.5">
                                <div
                                    className="bg-blue-600 h-2.5 rounded-full"
                                    style={{
                                        width: `${Math.abs(revenueData.monthlyPercentageChange)}%`,
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Top Services Section */}
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">
                            Top Services & Property Types
                        </h3>
                        <div className="space-y-3">
                            {topServicesData.map((item, index) => (
                                <div key={index} className="flex justify-between items-center">
                                    <div className="flex items-center space-x-3">
                                        <span className="text-sm font-medium text-gray-600">
                                            {index + 1}.
                                        </span>
                                        <span className="text-sm text-gray-700">
                                            {item.service} {item.type === 'propertyType' ? `(${item.type})` : ''}
                                        </span>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-800">
                                        {item.count} bookings
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Revenue by Worker Section */}
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">
                            Top Revenue by Worker
                        </h3>
                        <div className="space-y-3">
                            {topWorkersData.map((worker, index) => (
                                <div key={index} className="flex justify-between items-center">
                                    <div className="flex items-center space-x-3">
                                        <span className="text-sm font-medium text-gray-600">
                                            {index + 1}.
                                        </span>
                                        <span className="text-sm text-gray-700">{worker.name}</span>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-800">
                                        ${worker.revenue.toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* KPIs Section */}
            <section id="kpis" className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Top Referral Sources */}
                    <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">
                            Top Referral Sources
                        </h3>
                        <div className="w-full h-48 md:h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={topReferralSources}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={40}
                                        outerRadius={60}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {topReferralSources.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={COLORS[index % COLORS.length]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend
                                        layout="vertical"
                                        align="right"
                                        verticalAlign="middle"
                                        wrapperStyle={{ paddingLeft: '10px' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Average Job Duration per Service */}
                    <div className="bg-gradient-to-r from-green-100 to-green-200 p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">
                            Avg. Job Duration per Service
                        </h3>
                        <div className="space-y-2">
                            {averageJobDurations.map((service, index) => (
                                <div key={index} className="flex justify-between items-center">
                                    <div className="flex items-center space-x-3">
                                        <span className="text-sm text-gray-700">
                                            {service.name}
                                        </span>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-800">
                                        {service.duration} hrs
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Average Time per Worker List */}
                    <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">
                            Avg. Time per Worker
                        </h3>
                        <div className="space-y-2">
                            {workersAverage.map((worker, index) => (
                                <div key={index} className="flex justify-between items-center">
                                    <div className="flex items-center space-x-3">
                                        <span className="text-sm text-gray-700">{worker.name}</span>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-800">
                                        {worker.averageTime.toFixed(1)} hrs
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top 5 Locations or Cities */}
                    <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">
                            Top 5 Locations
                        </h3>
                        <div className="space-y-2">
                            {topQuebecCities.map((location, index) => (
                                <div key={index} className="flex justify-between items-center">
                                    <div className="flex items-center space-x-3">
                                        <span className="text-sm text-gray-700">
                                            {location.name}
                                        </span>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-800">
                                        {location.efficiency}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default DashboardContent;