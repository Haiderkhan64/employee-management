import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
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

export async function GET() {
  try {
    const employees = await prisma.employee.findMany({
      include: {
        contacts: true,
        locations: {
          include: {
            location: true,
          },
        },
      },
    });
    return NextResponse.json(employees);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch employees" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = EmployeeSchema.parse(body);

    const employee = await prisma.employee.create({
      data: {
        fullName: validatedData.fullName,
        dateOfBirth: new Date(validatedData.dateOfBirth),
        department: validatedData.department,
        jobTitle: validatedData.jobTitle,
        contacts: {
          create: validatedData.contacts || [],
        },
        locations: {
          create: validatedData.locations
            ? validatedData.locations.map((loc) => ({
                location: {
                  create: {
                    city: loc.city,
                    state: loc.state,
                    country: loc.country,
                  },
                },
              }))
            : [],
        },
      },
      include: {
        contacts: true,
        locations: {
          include: {
            location: true,
          },
        },
      },
    });

    return NextResponse.json(employee, { status: 201 });
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    } else {
      return NextResponse.json(
        { error: "Failed to create employee" },
        { status: 500 }
      );
    }
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    const validatedData = EmployeeSchema.parse(updateData);

    const employee = await prisma.employee.update({
      where: { id: Number(id) },
      data: {
        fullName: validatedData.fullName,
        dateOfBirth: new Date(validatedData.dateOfBirth),
        department: validatedData.department,
        jobTitle: validatedData.jobTitle,
        contacts: {
          deleteMany: {},
          create: validatedData.contacts || [],
        },
        locations: {
          deleteMany: {},
          create: validatedData.locations
            ? validatedData.locations.map((loc) => ({
                location: {
                  create: {
                    city: loc.city,
                    state: loc.state,
                    country: loc.country,
                  },
                },
              }))
            : [],
        },
      },
      include: {
        contacts: true,
        locations: {
          include: {
            location: true,
          },
        },
      },
    });

    return NextResponse.json(employee);
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    } else {
      return NextResponse.json(
        { error: "Failed to update employee" },
        { status: 500 }
      );
    }
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await prisma.employee.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json(
      { message: "Employee deleted successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      { error: `Failed to delete employee ${error}` },
      { status: 500 }
    );
  }
}
