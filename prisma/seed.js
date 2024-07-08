const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
    const usersData = [
        {
            username: 'alicema',
            firstName: 'Alice',
            lastName: 'Martin',
            email: 'alice.martin@googlemail.com',
        },
        {
            username: 'alisefart',
            firstName: 'Alise',
            lastName: 'Farting',
            email: 'alise.farting@yahoo.com',
        },
    ];

    const profilesData = [
        {
            profilePic: 'http://example.com/profile.jpg',
            biography: 'This is an example biography with a 120 character limit.',
        },
        {
            profilePic: 'http://example.com/profile12.jpg',
            biography: 'This is an example biography with a 120 character limit.',
        },
    ];

    const postsData = [
        {
            title: "Alice's First Post",
            content: "This is the content of Alice's first post.",
            published: true,
            pictureUrl: 'http://example.com/pic1.jpg',
        },
        {
            title: "Alice's Second Post",
            content: "This is the content of Alice's second post.",
            published: false,
            pictureUrl: 'http://example.com/pic2.jpg',
        },
        {
            title: "Alise's First Post",
            content: "This is the content of Alise's first post.",
            published: true,
            pictureUrl: 'http://example.com/pic3.jpg',
        },
    ];

    const commentsData = [
        {
            content: 'Great post, Alice!',
        },
        {
            content: 'Looking forward to more!',
        },
        {
            content: 'Nice work!',
        },
        {
            content: 'Interesting topic!',
        },
    ];

    try {
        const createdUsers = await prisma.user.createMany({
            data: usersData,
            skipDuplicates: true,
        });
        console.log(`${createdUsers.count} users created`);

        const users = await prisma.user.findMany();

        for (let i = 0; i < users.length; i++) {
            await prisma.profile.create({
                data: {
                    ...profilesData[i],
                    userId: users[i].id,
                },
            });
        }
        console.log(`${users.length} profiles created`);

        const createdPosts = [];
        for (let i = 0; i < postsData.length; i++) {
            const userId = i < 2 ? users[0].id : users[1].id;
            const post = await prisma.post.create({
                data: {
                    ...postsData[i],
                    userId,
                    comments: {
                        create: commentsData.slice(i * 2, (i + 1) * 2),
                    },
                },
                include: {
                    comments: true,
                },
            });
            createdPosts.push(post);
        }

        for (const post of createdPosts) {
            console.log(`Post "${post.title}" created with ID ${post.id}`);
            for (const comment of post.comments) {
                console.log(`- Comment "${comment.content}" created with ID ${comment.id}`);
            }
        }
    } catch (error) {
        console.error(`Error creating data: ${error.message}`);
        throw error;
    } finally {
        await prisma.$disconnect();
        process.exit(0);
    }
}

seed().catch((error) => {
    console.error(`Error in seed script: ${error.message}`);
    process.exit(1);
});
