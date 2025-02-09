"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const EmployeeSearch: React.FC = () => {
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [employees, setEmployees] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (city) queryParams.append("city", city);
      if (state) queryParams.append("state", state);
      if (country) queryParams.append("country", country);

      const response = await fetch(
        `/api/employees/search?${queryParams.toString()}`
      );
      if (!response.ok) throw new Error("Failed to fetch employees");

      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="main">
      <div className="inside-main">
        <div className="max-w-2xl mx-auto p-6 bg-slate-500 shadow-lg rounded-lg border border-gray-200">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            Search Employees
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
              <input
                type="text"
                placeholder="State"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
              <input
                type="text"
                placeholder="Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
            </div>

            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="w-full  bg-green-500 text-white p-3 rounded-lg hover:bg-blue-300  transition duration-200 disabled:bg-gray-400"
            >
              {isLoading ? "Searching..." : "Search"}
            </button>
          </div>

          <div className="mt-5">
            <button
              onClick={() => {
                router.push("../../");
              }}
              disabled={isLoading}
              className="w-full  bg-green-500 text-white p-3 rounded-lg hover:bg-blue-300  transition duration-200 disabled:bg-gray-400"
            >
              Add More Emplyees
            </button>
          </div>

          {/* Display Employees */}
          <div className="mt-6 space-y-4">
            {employees.map((employee) => (
              <div
                key={employee.id}
                className="p-4 border border-gray-200 rounded-lg"
              >
                <h3 className="text-lg font-semibold">{employee.fullName}</h3>
                <p className="text-sm text-gray-900">{employee.jobTitle}</p>
                <p className="text-sm text-gray-900">{employee.department}</p>
                <div className="mt-2">
                  <h4 className="text-md font-medium">Locations:</h4>
                  {employee.locations.map((location: any) => (
                    <div
                      key={location.location.id}
                      className="text-sm text-gray-900"
                    >
                      {location.location.city}, {location.location.state},{" "}
                      {location.location.country}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeSearch;
