import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import db from '@/lib/db';

// Force dynamic - this route cannot be statically rendered
export const dynamic = 'force-dynamic';

// Generate a unique slug from name
function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const random = Math.random().toString(36).substring(2, 8);
  return `${base}-${random}`;
}

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch user with owned accounts and related data
    let user = await db.user.findUnique({
      where: { clerkId: userId },
      include: {
        ownedAccounts: {
          include: {
            labSubscription: {
              include: {
                cycles: {
                  take: 1,
                  orderBy: { periodEnd: 'desc' }
                }
              }
            },
            nexusInstallation: true,
            productions: {
              select: { id: true }
            },
            cloneProfiles: {
              where: { type: 'VOICE' },
              select: { id: true }
            }
          }
        }
      }
    });

    // AUTO-PROVISION: Create user and account if they don't exist
    if (!user) {
      console.log('[Profile API] User not found, auto-provisioning...');

      // Get user details from Clerk
      const clerkUser = await currentUser();

      if (!clerkUser) {
        return NextResponse.json({ error: 'Could not fetch user details' }, { status: 500 });
      }

      const email = clerkUser.emailAddresses[0]?.emailAddress || '';
      const firstName = clerkUser.firstName || '';
      const lastName = clerkUser.lastName || '';
      const fullName = `${firstName} ${lastName}`.trim() || 'User';

      // Create user with account in a transaction
      user = await db.$transaction(async (tx) => {
        // Create user
        const newUser = await tx.user.create({
          data: {
            clerkId: userId,
            email,
            firstName: firstName || null,
            lastName: lastName || null,
            avatarUrl: clerkUser.imageUrl || null,
            emailVerified: clerkUser.emailAddresses[0]?.verification?.status === 'verified',
          }
        });

        console.log('[Profile API] Created user:', newUser.id);

        // Create account (free tier = no subscription)
        const accountSlug = generateSlug(fullName);
        const account = await tx.account.create({
          data: {
            name: `${fullName}'s Workspace`,
            slug: accountSlug,
            ownerId: newUser.id,
            type: 'PERSONAL',
          }
        });

        console.log('[Profile API] Created account:', account.id, 'slug:', accountSlug);

        // Re-fetch with all includes
        return tx.user.findUnique({
          where: { id: newUser.id },
          include: {
            ownedAccounts: {
              include: {
                labSubscription: {
                  include: {
                    cycles: {
                      take: 1,
                      orderBy: { periodEnd: 'desc' }
                    }
                  }
                },
                nexusInstallation: true,
                productions: {
                  select: { id: true }
                },
                cloneProfiles: {
                  where: { type: 'VOICE' },
                  select: { id: true }
                }
              }
            }
          }
        });
      });

      console.log('[Profile API] Auto-provisioning complete');
    }

    if (!user) {
      // This shouldn't happen after auto-provisioning, but fallback just in case
      return NextResponse.json({
        subscription: null,
        stats: {
          tokensUsed: 0,
          tokensTotal: 0,
          productions: 0,
          voiceClones: 0,
          nexusStatus: null
        },
        activities: []
      });
    }

    // Get the primary owned account (first one)
    const account = user.ownedAccounts?.[0];
    const subscription = account?.labSubscription;
    const currentCycle = subscription?.cycles?.[0];
    const nexusInstallation = account?.nexusInstallation;

    // Get token usage from cycle data
    const tokensTotal = currentCycle?.tokensAllocated || subscription?.monthlyTokens || 0;
    const tokensUsed = currentCycle?.tokensUsed || 0;

    // Count productions and voice clones from included data
    const productionsCount = account?.productions?.length || 0;
    const voiceClonesCount = account?.cloneProfiles?.length || 0;

    // Generate recent activities
    const activities = generateActivities(user.createdAt);

    return NextResponse.json({
      subscription: subscription ? {
        tier: subscription.tier,
        status: subscription.status,
        billingCycle: subscription.billingInterval,
        nextBillingDate: subscription.currentPeriodEnd
      } : null,
      stats: {
        tokensUsed,
        tokensTotal,
        productions: productionsCount,
        voiceClones: voiceClonesCount,
        nexusStatus: nexusInstallation?.phase || null
      },
      activities
    });
  } catch (error) {
    console.error('Error fetching profile data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile data' },
      { status: 500 }
    );
  }
}

// Generate activities based on user data
function generateActivities(userCreatedAt: Date) {
  const now = new Date();

  return [
    {
      id: '1',
      type: 'LOGIN',
      title: 'Signed in',
      description: 'New session started',
      timestamp: now
    },
    {
      id: '2',
      type: 'MILESTONE',
      title: 'Account created',
      description: 'Welcome to Barrios A2I',
      timestamp: userCreatedAt
    }
  ];
}
