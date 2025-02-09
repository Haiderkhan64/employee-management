import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type LocationFilter = {
  city?: { contains: string; mode: "insensitive" };
  state?: { contains: string; mode: "insensitive" };
  country?: { contains: string; mode: "insensitive" };
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const city = searchParams.get("city");
    const state = searchParams.get("state");
    const country = searchParams.get("country");

    const locationFilter: LocationFilter = {};
    if (city) locationFilter.city = { contains: city, mode: "insensitive" };
    if (state) locationFilter.state = { contains: state, mode: "insensitive" };
    if (country)
      locationFilter.country = { contains: country, mode: "insensitive" };

    const employees = await prisma.employee.findMany({
      include: {
        contacts: true,
        locations: {
          include: {
            location: true,
          },
          where: {
            location: locationFilter,
          },
        },
      },
    });

    const filteredEmployees = employees.filter(
      (employee) => employee.locations.length > 0
    );

    return NextResponse.json(filteredEmployees);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch employees" },
      { status: 500 }
    );
  }
}
