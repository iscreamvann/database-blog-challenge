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
        try {
            const { profiles, posts, ...userWithoutPosts } = userData;

            // Constructing the data object to be passed to prisma.user.create()
            const data = {
                username: userWithoutPosts.username,
                firstName: userWithoutPosts.firstName,
                lastName: userWithoutPosts.lastName,
                email: userWithoutPosts.email,
                profiles: {
                    create: profiles.create,
                },
                posts: {
                    create: posts.create.map(post => ({
                        title: post.title,
                        content: post.content,
                        published: post.published,
                        pictureUrl: post.pictureUrl,
                        comments: {
                            create: post.comments.create,
                        },
                    })),
                },
            };

            console.log('Creating user with data:');
            console.log(data);

            const user = await prisma.user.create({
                data,
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
        } catch (error) {
            console.error(`Error creating user: ${error.message}`);
            throw error; // Re-throw the error to stop further execution on error
        }
    }

    console.log(`${usersData.length} users created`);

    // Disconnect Prisma client after seeding
    await prisma.$disconnect();
    process.exit(0); // Exit process with success code
}

seed().catch((error) => {
    console.error(`Error in seed script: ${error.message}`);
    process.exit(1); // Exit process with error code
});
