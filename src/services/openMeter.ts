"use server";

// import { OpenMeter  } from "@openmeter/sdk";
import { addTokenToQueue } from "./bullmq";
import { getUser } from "~/utils/clerk-utility";
import { OpenMeter, WindowSize } from "@openmeter/sdk"; // Ensure WindowSize is a runtime value


const openmeter = new OpenMeter({
    baseUrl: process.env.OPEN_METER_BASE_URL!,
    apiKey: process.env.OPEN_METER_SECRET!,
});


// export const getTokenUsageForAnalytics = async (
//     userIds: string[],
//     workspaceId: string,
//     fetchDataOption: string
// ) => {
//     const paymentIds = userIds.map((userId) => `${workspaceId}:${userId}`);
//     try {
//         const now = new Date();
//         now.setMinutes(0, 0, 0);
//         const startDate = new Date(now);
//         startDate.setDate(now.getDate() - (fetchDataOption === "weekly" ? 7 : 1));
//         startDate.setMinutes(0, 0, 0);

//         const values = await openmeter.meters.query("tokens", {
//             subject: paymentIds,
//             from: startDate,
//             windowSize: WindowSize.DAY,
//         });

//         return values;
//     } catch (err) {
//         console.error("Error fetching token usage:", err);
//         throw new Error("Failed to fetch token usage");
//     }
// };

// export const getTokens = async (
//     isSubscribed: boolean,
//     organizationId: string
// ) => {
//     const user = await getUser();
//     if (!user) throw new Error("User not found");

//     const date = new Date();
//     const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
//     const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

//     const paymentId = `${organizationId}:${user.id}`;

//     const values = await openmeter.meters.query("tokens", {
//         subject: [paymentId],
//         from: isSubscribed ? firstDay : undefined,
//         to: isSubscribed ? lastDay : undefined,
//     });

//     const data = values?.data?.length === 0 ? 0 : values?.data[0].value;
//     console.log("My tokens", data);
//     return data;
// };

export const createTokens = async (
    tokens: number,
    organizationId: string
) => {
    const user = await getUser();
    if (!user) throw new Error("User not found");

    const userId = `${organizationId}:${user.id}`;
    await addTokenToQueue({ userId, tokens });
};


