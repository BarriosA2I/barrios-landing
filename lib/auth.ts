import { auth, currentUser } from '@clerk/nextjs/server';
import { db } from './db';

export async function getCurrentUser() {
  const user = await currentUser();
  if (!user) return null;

  return user;
}

export async function getOrCreateDbUser() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  // Find or create user in database
  let dbUser = await db.user.findUnique({
    where: { clerkId: clerkUser.id },
    include: {
      accounts: {
        include: {
          account: true,
        },
      },
      ownedAccounts: true,
    },
  });

  if (!dbUser) {
    // Create user and default personal account
    const slug = clerkUser.emailAddresses[0]?.emailAddress
      .split('@')[0]
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '') || `user-${Date.now()}`;

    dbUser = await db.user.create({
      data: {
        clerkId: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        emailVerified: clerkUser.emailAddresses[0]?.verification?.status === 'verified',
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        avatarUrl: clerkUser.imageUrl,
        phone: clerkUser.phoneNumbers[0]?.phoneNumber,
        phoneVerified: clerkUser.phoneNumbers[0]?.verification?.status === 'verified',
        ownedAccounts: {
          create: {
            name: `${clerkUser.firstName || 'My'}'s Account`,
            slug: `${slug}-${Date.now().toString(36)}`,
            type: 'PERSONAL',
            members: {
              create: {
                userId: '', // Will be updated after user creation
                role: 'OWNER',
              },
            },
          },
        },
      },
      include: {
        accounts: {
          include: {
            account: true,
          },
        },
        ownedAccounts: true,
      },
    });

    // Fix the self-referencing member
    if (dbUser.ownedAccounts[0]) {
      await db.accountMember.updateMany({
        where: {
          accountId: dbUser.ownedAccounts[0].id,
          userId: '',
        },
        data: {
          userId: dbUser.id,
        },
      });
    }
  }

  return dbUser;
}

export async function getUserAccounts() {
  const user = await getOrCreateDbUser();
  if (!user) return [];

  const accounts = await db.account.findMany({
    where: {
      members: {
        some: {
          userId: user.id,
        },
      },
    },
    include: {
      labSubscription: true,
      nexusInstallation: true,
      billingCustomer: true,
    },
  });

  return accounts;
}

export async function getAccountById(accountId: string) {
  const user = await getOrCreateDbUser();
  if (!user) return null;

  const account = await db.account.findFirst({
    where: {
      id: accountId,
      members: {
        some: {
          userId: user.id,
        },
      },
    },
    include: {
      members: {
        include: {
          user: true,
        },
      },
      labSubscription: {
        include: {
          cycles: {
            orderBy: { cycleNumber: 'desc' },
            take: 1,
            include: {
              ledgerEntries: {
                orderBy: { createdAt: 'desc' },
              },
            },
          },
        },
      },
      nexusInstallation: {
        include: {
          intake: true,
          maintenanceSub: true,
          addOnPurchases: true,
          checklist: true,
        },
      },
      billingCustomer: {
        include: {
          paymentMethods: true,
          invoices: {
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
        },
      },
      productions: {
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      cloneProfiles: true,
      supportTickets: {
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
    },
  });

  return account;
}

export async function getTokenBalance(accountId: string) {
  const account = await db.account.findUnique({
    where: { id: accountId },
    include: {
      labSubscription: {
        include: {
          cycles: {
            where: {
              periodStart: { lte: new Date() },
              periodEnd: { gte: new Date() },
            },
            include: {
              ledgerEntries: { orderBy: { createdAt: 'desc' }, take: 1 },
            },
          },
        },
      },
    },
  });

  if (!account?.labSubscription?.cycles[0]) {
    return { available: 0, used: 0, allocated: 0, cycleEnd: null };
  }

  const cycle = account.labSubscription.cycles[0];
  const latestEntry = cycle.ledgerEntries[0];

  return {
    available: latestEntry?.balance ?? cycle.tokensAllocated,
    used: cycle.tokensUsed,
    allocated: cycle.tokensAllocated,
    cycleEnd: cycle.periodEnd,
  };
}

export async function getSession() {
  return await auth();
}
