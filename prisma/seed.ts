import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const employee = await prisma.employee.create({
    data: {
      fullName: "Uzair",
      dateOfBirth: new Date("1990-05-15"),
      department: "IT",
      jobTitle: "Software Engineer",
      contacts: {
        create: [
          { contactType: "Work", phoneNumber: "0333337890" },
          { contactType: "Mobile", phoneNumber: "0333344444" },
        ],
      },
      locations: {
        create: {
          location: {
            create: { city: "New York", state: "NY", country: "USA" },
          },
        },
      },
    },
  });

  console.log({ employee });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
