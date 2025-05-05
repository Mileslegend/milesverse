import { adminClient } from "@/sanity/lib/adminClient";
import {z} from "zod";
import { tool } from "ai"
//import { Patch } from "next-sanity";

export const censorPost = tool({
    description: "Censor inappropriate content in post title and body",
    parameters: z.object({
      postId: z.string().describe("The ID of the post to censor"),
      title: z.string().optional().describe("Censored version of the title"),
      body: z.string().optional().describe("Censored version of the body"),
      isToBeReported: z
        .boolean()
        .optional()
        .describe(
          "If the post contains prohibited content, return true, otherwise return false"
        ),
    }),
  
    execute: async ({ postId, title, body, isToBeReported }) => {
      if (!isToBeReported) {
        console.log(`>>>>> Post ${postId} is not reported`);
        return {
          success: true,
          message: `Post ${postId} is not reported`,
        };
      }
  
      console.log(`>>>>> Censoring content in post ${postId}`);
  
      const patch = adminClient.patch(postId);
  
      if (title) {
        console.log(`>>>> Censoring title: ${title}`);
        patch.set({ title });
      }
  
      if (body) {
        console.log(`>>>>>> Censoring body: ${body}`);
        // Convert body to Portable Text format
        const portableTextBody = [
          {
            _type: "block",
            _key: Date.now().toString(),
            children: [
              {
                _type: "span",
                _key: Date.now().toString() + "1",
                text: body,
              },
            ],
          },
        ];
        patch.set({ body: portableTextBody });
      }
  
      // Always set isReported if flagged
      patch.set({ isReported: true });
  
      await patch.commit();
  
      return {
        postId,
        censored: true,
        message: "Content has been censored",
      };
    },
  });

export const reportUser = tool({
    description: "Report a user for violating community guidelines",
    parameters: z.object({
        userId: z.string().describe("The ID of the user to report")
    }),
    execute: async ({ userId}) => {
        console.log(`>>>>> Reporting user ${userId}`);
        const patch = adminClient.patch(userId);
        patch.set({ isReported: true});
        await patch.commit();

        console.log("user Reported successfully");

        return {
            success: true,
            message: `User ${userId} eported successfully`,
        }
    }
})