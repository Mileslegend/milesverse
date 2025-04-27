import { defineQuery } from "groq";
import { sanityFetch } from "../live";
import { currentUser } from "@clerk/nextjs/server";
import { addUser } from "./addUser";

interface UserResult {
  _id: string;
  username: string;
  imageUrl: string;
  email: string;
}

export async function getUser(): Promise<UserResult | { error: string }> {
  try {
    console.log("Getting user from Clerk");
    const loggedInUser = await currentUser();

    if (!loggedInUser) {
      console.log("No user logged In");
      return { error: "User not found" };
    }

    console.log(`Found Clerk user: ${loggedInUser.id}`);

    //Check if user exists in the database
    const getExistingUserQuery = defineQuery(
      `*[_type == "user" && _id == $id][0]`
    );

    console.log("Checking whether user exists in the Sanity database");
    const existingUser = await sanityFetch({
      query: getExistingUserQuery,
      params: { id: loggedInUser.id },
    });
  } catch (error) {}
}
