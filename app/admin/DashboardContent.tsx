"use client";

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
} from "recharts";
import {
    CheckCircleIcon,
    ClockIcon,
    CurrencyDollarIcon,
    UsersIcon,
    ArrowUpIcon,
    ArrowDownIcon,
} from "@heroicons/react/24/outline";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const DashboardContent = () => {
    // Dummy data for percentage change compared to the previous day
    const percentageChange = {
        incomeToday: 15, // +15%
        incomeWeekly: 10, // +10%
        incomeMonthly: 8, // +8%
    };

    // Dummy data for charts
    const topServicesData = [
        { service: "Apartment Cleaning", revenue: 5000 },
        { service: "Carpet Cleaning", revenue: 4500 },
        { service: "Deep Cleaning", revenue: 4000 },
        { service: "Window Cleaning", revenue: 3500 },
        { service: "Office Cleaning", revenue: 3000 },
    ];

    const topWorkersData = [
        { name: "John Doe", revenue: 12000 },
        { name: "Jane Smith", revenue: 11000 },
        { name: "Mike Johnson", revenue: 9500 },
        { name: "Emily Davis", revenue: 9000 },
        { name: "Chris Brown", revenue: 8500 },
    ];

    const averageJobDurations = [
        { name: "Apartment Cleaning", duration: 2.5 },
        { name: "Carpet Cleaning", duration: 3.0 },
        { name: "Window Cleaning", duration: 1.5 },
        { name: "Deep Cleaning", duration: 4.0 },
        { name: "Office Cleaning", duration: 2.0 },
    ];

    const topReferralSources = [
        { name: "Google", value: 120 },
        { name: "Facebook", value: 80 },
        { name: "Instagram", value: 60 },
        { name: "Client Referrals", value: 40 },
        { name: "Other", value: 20 },
    ];

    const topQuebecCities = [
        { name: "Montreal", efficiency: 95 },
        { name: "Quebec City", efficiency: 92 },
        { name: "Laval", efficiency: 90 },
        { name: "Gatineau", efficiency: 88 },
        { name: "Longueuil", efficiency: 85 },
    ];

    const workersAverage = [
        { name: "John Doe", averageTime: 2.5 },
        { name: "Jane Smith", averageTime: 2.0 },
        { name: "Mike Johnson", averageTime: 2.3 },
        { name: "Emily Davis", averageTime: 2.1 },
        { name: "Chris Brown", averageTime: 2.4 },
    ];

    return (
        <div className="flex-1 p-4 md:p-8">
            {/* Top Metrics Section */}
            <section id="top-metrics" className="mb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Today's Total Works Done */}
                    <div className="bg-gradient-to-r from-green-100 to-green-200 p-4 rounded-lg shadow-md flex items-center space-x-4">
                        <div className="p-2 bg-green-200 rounded-full">
                            <CheckCircleIcon className="h-6 w-6 text-green-700" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-700">Today's Schedule</p>
                            <p className="text-xl font-bold text-gray-800">5 Bookings</p>
                        </div>
                    </div>

                    {/* Upcoming Appointments */}
                    <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 p-4 rounded-lg shadow-md flex items-center space-x-4">
                        <div className="p-2 bg-yellow-200 rounded-full">
                            <ClockIcon className="h-6 w-6 text-yellow-700" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-700">Upcoming Appointments</p>
                            <p className="text-xl font-bold text-gray-800">12 Bookings</p>
                        </div>
                    </div>

                    {/* Active Jobs */}
                    <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-4 rounded-lg shadow-md flex items-center space-x-4">
                        <div className="p-2 bg-blue-200 rounded-full">
                            <UsersIcon className="h-6 w-6 text-blue-700" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-700">Active Jobs</p>
                            <p className="text-xl font-bold text-gray-800">3 In Progress</p>
                        </div>
                    </div>

                    {/* Completed Jobs */}
                    <div className="bg-gradient-to-r from-purple-100 to-purple-200 p-4 rounded-lg shadow-md flex items-center space-x-4">
                        <div className="p-2 bg-purple-200 rounded-full">
                            <CurrencyDollarIcon className="h-6 w-6 text-purple-700" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-700">Completed Jobs</p>
                            <p className="text-xl font-bold text-gray-800">20 Completed</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Revenue Overview Section */}
            <section id="revenue-overview" className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Daily Revenue Progress */}
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Revenue Overview</h3>

                        {/* Daily Revenue */}
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="flex-1">
                                <p className="text-sm text-gray-600">Today's Revenue</p>
                                <p className="text-xl font-bold text-gray-800">$2,500</p>
                                <div className="flex items-center space-x-2 mt-2">
                                    {percentageChange.incomeToday > 0 ? (
                                        <ArrowUpIcon className="h-4 w-4 text-green-600" />
                                    ) : (
                                        <ArrowDownIcon className="h-4 w-4 text-red-600" />
                                    )}
                                    <p
                                        className={`text-sm ${percentageChange.incomeToday > 0 ? "text-green-600" : "text-red-600"
                                            }`}
                                    >
                                        {Math.abs(percentageChange.incomeToday)}% compared to yesterday
                                    </p>
                                </div>
                            </div>
                            {/* Progress Bar */}
                            <div className="w-1/3 bg-gray-200 rounded-full h-2.5">
                                <div
                                    className="bg-blue-600 h-2.5 rounded-full"
                                    style={{ width: `${Math.abs(percentageChange.incomeToday)}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Weekly Revenue */}
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="flex-1">
                                <p className="text-sm text-gray-600">Weekly Revenue</p>
                                <p className="text-xl font-bold text-gray-800">$12,000</p>
                                <div className="flex items-center space-x-2 mt-2">
                                    {percentageChange.incomeWeekly > 0 ? (
                                        <ArrowUpIcon className="h-4 w-4 text-green-600" />
                                    ) : (
                                        <ArrowDownIcon className="h-4 w-4 text-red-600" />
                                    )}
                                    <p
                                        className={`text-sm ${percentageChange.incomeWeekly > 0 ? "text-green-600" : "text-red-600"
                                            }`}
                                    >
                                        {Math.abs(percentageChange.incomeWeekly)}% compared to last week
                                    </p>
                                </div>
                            </div>
                            {/* Progress Bar */}
                            <div className="w-1/3 bg-gray-200 rounded-full h-2.5">
                                <div
                                    className="bg-blue-600 h-2.5 rounded-full"
                                    style={{ width: `${Math.abs(percentageChange.incomeWeekly)}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Monthly Revenue */}
                        <div className="flex items-center space-x-4">
                            <div className="flex-1">
                                <p className="text-sm text-gray-600">Monthly Revenue</p>
                                <p className="text-xl font-bold text-gray-800">$50,000</p>
                                <div className="flex items-center space-x-2 mt-2">
                                    {percentageChange.incomeMonthly > 0 ? (
                                        <ArrowUpIcon className="h-4 w-4 text-green-600" />
                                    ) : (
                                        <ArrowDownIcon className="h-4 w-4 text-red-600" />
                                    )}
                                    <p
                                        className={`text-sm ${percentageChange.incomeMonthly > 0 ? "text-green-600" : "text-red-600"
                                            }`}
                                    >
                                        {Math.abs(percentageChange.incomeMonthly)}% compared to last month
                                    </p>
                                </div>
                            </div>
                            {/* Progress Bar */}
                            <div className="w-1/3 bg-gray-200 rounded-full h-2.5">
                                <div
                                    className="bg-blue-600 h-2.5 rounded-full"
                                    style={{ width: `${Math.abs(percentageChange.incomeMonthly)}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Top Services Section */}
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Top Services</h3>
                        <div className="space-y-3">
                            {topServicesData.map((service, index) => (
                                <div key={index} className="flex justify-between items-center">
                                    <div className="flex items-center space-x-3">
                                        <span className="text-sm font-medium text-gray-600">{index + 1}.</span>
                                        <span className="text-sm text-gray-700">{service.service}</span>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-800">${service.revenue}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Revenue by Worker Section */}
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Top Revenue by Worker</h3>
                        <div className="space-y-3">
                            {topWorkersData.map((worker, index) => (
                                <div key={index} className="flex justify-between items-center">
                                    <div className="flex items-center space-x-3">
                                        <span className="text-sm font-medium text-gray-600">{index + 1}.</span>
                                        <span className="text-sm text-gray-700">{worker.name}</span>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-800">${worker.revenue}</span>
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
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Top Referral Sources</h3>
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
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend
                                        layout="vertical"
                                        align="right"
                                        verticalAlign="middle"
                                        wrapperStyle={{ paddingLeft: "10px" }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Average Job Duration per Service */}
                    <div className="bg-gradient-to-r from-green-100 to-green-200 p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Avg. Job Duration per Service</h3>
                        <div className="space-y-2">
                            {averageJobDurations.map((service, index) => (
                                <div key={index} className="flex justify-between items-center">
                                    <div className="flex items-center space-x-3">
                                        <span className="text-sm text-gray-700">{service.name}</span>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-800">{service.duration} hrs</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Average Time per Worker List */}
                    <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Avg. Time per Worker</h3>
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
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Top 5 Locations</h3>
                        <div className="space-y-2">
                            {topQuebecCities.map((location, index) => (
                                <div key={index} className="flex justify-between items-center">
                                    <div className="flex items-center space-x-3">
                                        <span className="text-sm text-gray-700">{location.name}</span>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-800">{location.efficiency}%</span>
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