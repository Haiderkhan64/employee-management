"use client";
import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";

const EmployeeSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  dateOfBirth: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Invalid date"),
  department: z.string().min(1, "Department is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  contacts: z
    .array(
      z.object({
        contactType: z.string().min(1, "Contact type is required"),
        phoneNumber: z.string().min(1, "Phone number is required"),
      })
    )
    .optional(),
  locations: z
    .array(
      z.object({
        city: z.string().min(1, "City is required"),
        state: z.string().min(1, "State is required"),
        country: z.string().min(1, "Country is required"),
      })
    )
    .optional(),
});

type EmployeeFormData = z.infer<typeof EmployeeSchema>;

const EmployeeForm: React.FC = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(EmployeeSchema),
    defaultValues: {
      contacts: [{ contactType: "", phoneNumber: "" }],
      locations: [{ city: "", state: "", country: "" }],
    },
  });

  const {
    fields: contactFields,
    append: appendContact,
    remove: removeContact,
  } = useFieldArray({
    control,
    name: "contacts",
  });

  const {
    fields: locationFields,
    append: appendLocation,
    remove: removeLocation,
  } = useFieldArray({
    control,
    name: "locations",
  });

  const onSubmit = async (data: EmployeeFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Something went wrong");
      }

      alert("Employee added successfully!");
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="main">
      <div className="inside-main">
        <div className="max-w-2xl mx-auto p-6 bg-slate-500 shadow-lg rounded-lg border border-gray-200">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Add New Employee
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Full Name and Date of Birth */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  {...register("fullName")}
                  placeholder="Full Name"
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 text-gray-900 ${
                    errors.fullName
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.fullName.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  {...register("dateOfBirth")}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 text-gray-900 ${
                    errors.dateOfBirth
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                {errors.dateOfBirth && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.dateOfBirth.message}
                  </p>
                )}
              </div>
            </div>

            {/* Department and Job Title */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <select
                  {...register("department")}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 text-gray-900 ${
                    errors.department
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                >
                  <option value="">Select Department</option>
                  <option value="HR">Human Resources</option>
                  <option value="IT">Information Technology</option>
                  <option value="Finance">Finance</option>
                  <option value="Sales">Sales</option>
                </select>
                {errors.department && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.department.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title
                </label>
                <input
                  {...register("jobTitle")}
                  placeholder="Job Title"
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 text-gray-900 ${
                    errors.jobTitle
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                {errors.jobTitle && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.jobTitle.message}
                  </p>
                )}
              </div>
            </div>

            {/* Contacts Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  Contacts
                </h3>
                <button
                  type="button"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                  onClick={() =>
                    appendContact({ contactType: "", phoneNumber: "" })
                  }
                >
                  Add Contact
                </button>
              </div>
              {contactFields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  <select
                    {...register(`contacts.${index}.contactType`)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  >
                    <option value="">Contact Type</option>
                    <option value="work">Work</option>
                    <option value="personal">Personal</option>
                    <option value="emergency">Emergency</option>
                  </select>
                  <input
                    {...register(`contacts.${index}.phoneNumber`)}
                    placeholder="Phone Number"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                  {contactFields.length > 1 && (
                    <button
                      type="button"
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
                      onClick={() => removeContact(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Locations Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  Locations
                </h3>
                <button
                  type="button"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                  onClick={() =>
                    appendLocation({ city: "", state: "", country: "" })
                  }
                >
                  Add Location
                </button>
              </div>
              {locationFields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-1 md:grid-cols-4 gap-4"
                >
                  <input
                    {...register(`locations.${index}.city`)}
                    placeholder="City"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                  <input
                    {...register(`locations.${index}.state`)}
                    placeholder="State"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                  <input
                    {...register(`locations.${index}.country`)}
                    placeholder="Country"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                  {locationFields.length > 1 && (
                    <button
                      type="button"
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
                      onClick={() => removeLocation(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-blue-300 transition duration-200 disabled:bg-gray-400"
              >
                {isSubmitting ? "Submitting..." : "Add Employee"}
              </button>
            </div>

            <div>
              <button
                type="button"
                onClick={() => {
                  router.push("./employees");
                }}
                disabled={isSubmitting}
                className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-blue-300 transition duration-200 disabled:bg-gray-400"
              >
                All Employees
              </button>
            </div>

            {/* Error Message */}
            {submitError && (
              <div className="text-red-500 text-sm text-center mt-4">
                {submitError}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmployeeForm;
