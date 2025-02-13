"use server";

import { db } from "~/server/db";
import { PLANS } from "~/lib/constants";
import { stripe } from "~/utils/stripe";
import { getUser } from "~/utils/clerk-utility";

export async function getUserSubscriptionPlan() {
  const user = await getUser();

  if (!user?.id) {
    return {
      ...PLANS[0],
      isSubscribed: false,
      isCanceled: false,
      stripeCurrentPeriodEnd: null,
    };
  }

  const dbUser = await db.user.findFirst({
    where: {
      id: user.id,
    },
  });

  if (!dbUser) {
    const unAuthPlanData = {
      ...PLANS[0],
      isSubscribed: false,
      isCanceled: false,
      stripeCurrentPeriodEnd: null,
    };

    type UnAuthPlanData = typeof unAuthPlanData;

    return JSON.parse(JSON.stringify(unAuthPlanData)) as UnAuthPlanData;
  }

  const isSubscribed = Boolean(
    dbUser.stripePriceId &&
      dbUser.stripeCurrentPeriodEnd && // 86400000 = 1 day
      dbUser.stripeCurrentPeriodEnd.getTime() + 86_400_000 > Date.now()
  );

  const plan = isSubscribed
    ? PLANS.find((plan) => plan.price.priceIds.test === dbUser.stripePriceId)
    : null;

  let isCanceled = false;
  if (isSubscribed && dbUser.stripeSubscriptionId) {
    const stripePlan = await stripe.subscriptions.retrieve(
      dbUser.stripeSubscriptionId
    );
    isCanceled = stripePlan.cancel_at_period_end;
  }

  const authedPlanData = {
    ...plan,
    stripeSubscriptionId: dbUser.stripeSubscriptionId,
    stripeCurrentPeriodEnd: dbUser.stripeCurrentPeriodEnd,
    stripeCustomerId: dbUser.stripeCustomerId,
    isSubscribed,
    isCanceled,
  };

  type AuthedPlanData = typeof authedPlanData;

  return JSON.parse(JSON.stringify(authedPlanData)) as AuthedPlanData;
}

export const getIsSubscribed = async () => {
  return (await getUserSubscriptionPlan()).isSubscribed;
};
