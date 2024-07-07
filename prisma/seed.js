const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
    const usersData = [
        {
            username: 'alicema',
            firstName: 'alice',
            lastName: 'martin',
            email: 'alice.martin@googlemail.com',
            profiles: {
                create: {
                    profilePic: 'http://example.com/profile.jpg',
                    biography: 'This is an example biography with a 120 character limit.',
                },
            },
        },
        {
            username: 'alisefart',
            firstName: 'alise',
            lastName: 'farting',
            email: 'alise.farting@yahoo.com',
            profiles: {
                create: {
                    profilePic: 'http://example.com/profile12.jpg',
                    biography: 'This is an example biography with a 120 character limit.',
                },
            },
        },
    ];

    for (const userData of usersData) {
        await prisma.user.create({
            data: userData,
        });
    }

    console.log(`${usersData.length} users created`);

    // Add your code here

    // Don't edit any of the code below this line
    process.exit(0);
}

seed()
    .catch(async (error) => {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    });
