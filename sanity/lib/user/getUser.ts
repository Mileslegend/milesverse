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

const parseUsername = (username: string) => {
    //Remove whitespace amd convertto camelCase with Random number to avoid conflicts
    const randomNum = Math.floor( 1000 + Math.random() * 9000);
    return (
        username
        .replace(/\s+(.)/g, (_, char) => char.toUpperCase()) //convert whitespace to camel case
        .replace(/\s+/g, "")+randomNum //remove allw hite spaces and add a random number
    )
}


export async function getUser(): Promise<UserResult | { error: string }> {
  try {
    console.log("---  Getting user from Clerk  ---");
    const loggedInUser = await currentUser();

    if (!loggedInUser) {
      console.log("---No user logged In --- ");
      return { error: "User not found" };
    }

    console.log(`Found Clerk user: ${loggedInUser.id}`);

    //Check if user exists in the database
    const getExistingUserQuery = defineQuery(
      `*[_type == "user" && _id == $id][0]`
    );

    console.log("Checking whether user exists in the Sanity database ...");
    const existingUser = await sanityFetch({
      query: getExistingUserQuery,
      params: { id: loggedInUser.id },
    });

    //if user exists, return the user data
    if (existingUser.data?._id) {
      console.log(`User found in database with iD: ${existingUser.data._id} `);
      const user = {
        _id: existingUser.data._id,
        username: existingUser.data.username!,
        imageUrl: existingUser.data.imageUrl!,
        email: existingUser.data.email,
      };
      
      return user;
    }

    //If user doesnt exist , create a new one
    console.log("User not found in database, creating new user...");
    const newUser = await addUser({
      id: loggedInUser.id,
      username: parseUsername(loggedInUser.fullName!),
      email:
        loggedInUser.primaryEmailAddress?.emailAddress ||
        loggedInUser.emailAddresses[0].emailAddress,
      imageUrl: loggedInUser.imageUrl,
    });

    console.log(`New user created with ID: ${newUser._id} `)
    const user = {
        _id: newUser._id,
        username: newUser.username!,
        imageUrl: newUser.imageUrl,
        email: newUser.email
    };

    return user


  } catch (error) {
    console.error("Error getting user:", error);
    return { error: "Failed to get User" }
  }
}
