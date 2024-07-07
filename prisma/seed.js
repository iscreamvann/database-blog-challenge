const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
    const usersData = [
        {
            username: 'alicema',
            firstName: 'Alice',
            lastName: 'Martin',
            email: 'alice.martin@googlemail.com',
            profiles: {
                create: {
                    profilePic: 'http://example.com/profile.jpg',
                    biography: 'This is an example biography with a 120 character limit.',
                },
            },
            posts: {
                create: [
                    {
                        title: 'Alice\'s First Post',
                        content: 'This is the content of Alice\'s first post.',
                        published: true,
                        pictureUrl: 'http://example.com/pic1.jpg',
                        comments: {
                            create: [
                                {
                                    content: 'Great post, Alice!',
                                },
                                {
                                    content: 'Looking forward to more!',
                                },
                            ],
                        },
                    },
                    {
                        title: 'Alice\'s Second Post',
                        content: 'This is the content of Alice\'s second post.',
                        published: false,
                        pictureUrl: 'http://example.com/pic2.jpg',
                        comments: {
                            create: [
                                {
                                    content: 'Nice work!',
                                },
                            ],
                        },
                    },
                ],
            },
        },
        {
            username: 'alisefart',
            firstName: 'Alise',
            lastName: 'Farting',
            email: 'alise.farting@yahoo.com',
            profiles: {
                create: {
                    profilePic: 'http://example.com/profile12.jpg',
                    biography: 'This is an example biography with a 120 character limit.',
                },
            },
            posts: {
                create: [
                    {
                        title: 'Alise\'s First Post',
                        content: 'This is the content of Alise\'s first post.',
                        published: true,
                        pictureUrl: 'http://example.com/pic3.jpg',
                        comments: {
                            create: [
                                {
                                    content: 'Interesting topic!',
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ];

    for (const userData of usersData) {
        const { profiles, posts, ...userWithoutPosts } = userData;
        const user = await prisma.user.create({
            data: {
                ...userWithoutPosts,
                profiles: {
                    create: profiles.create,
                },
                posts: {
                    create: posts.create.map(post => ({
                        ...post,
                        comments: {
                            create: post.comments.create,
                        },
                    })),
                },
            },
            include: {
                posts: {
                    include: {
                        comments: true,
                    },
                },
            },
        });

        console.log(`User ${user.username} created with ID ${user.id}`);

        for (const post of user.posts) {
            console.log(`Post "${post.title}" created with ID ${post.id}`);

            for (const comment of post.comments) {
                console.log(`- Comment "${comment.content}" created with ID ${comment.id}`);
            }
        }
    }

    console.log(`${usersData.length} users created`);

    // Don't edit any of the code below this line
    await prisma.$disconnect();
    process.exit(0);
}

seed().catch((error) => {
    console.error(error);
    process.exit(1);
});
