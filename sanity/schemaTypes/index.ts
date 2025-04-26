import { type SchemaTypeDefinition } from "sanity";
import { userType } from "./userType";
import { postType } from "./postType";
import { subverseType } from "./subverseType";
import { commentType } from "./commentType";
import { voteType } from "./voteType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [userType, postType, subverseType, commentType, voteType],
};
