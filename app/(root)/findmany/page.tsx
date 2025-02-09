import { prisma } from "@/lib/prisma";

const page = async () => {
  const prismaClient = await prisma.contact.findMany();
  return (
    <div>
      {prismaClient.map((eachContect) => {
        const { id, employeeId, phoneNumber } = eachContect;
        return (
          <div key={eachContect.id}>
            <h1>{id}</h1>
            <h2>{employeeId}</h2>
            <h1>{phoneNumber}</h1>
          </div>
        );
      })}
    </div>
  );
};

export default page;
