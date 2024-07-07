const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
    const createdUsers = await prisma.user.createMany({
        data: [
            { username: 'alicemartin', firstName: 'alice', lastName: 'martin', email: 'alice.martin@googlemail.cum' },
            { username: 'alisefarting', firstName: 'alise', lastName: 'farting', email: 'alise.farting@yahoo.cum' }
        ]
    });

    console.log(`${createdUsers.count} users created`, createdUsers);

    // Add your code here

    


    // Don't edit any of the code below this line
    process.exit(0);
}

seed()
    .catch(async (error) => {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    })