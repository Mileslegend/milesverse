import { Flag } from "lucide-react";
import type { StructureResolver } from "sanity/structure";

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      ...S.documentTypeListItems(),
      // add reported section
      S.listItem()
        .title("Reported")
        .icon(() => {
          return (
            <span style={{ fontWeight: "bold", color: "red" }}>
              <Flag />
            </span>
          );
        })
        .child(
          S.list()
            .title("Reported Content to be reviewed")
            .items([
              S.listItem()
                .title("Posts")
                .child(
                  S.documentTypeList("post")
                    .title("Reported Posts")
                    .filter('_type == "post" && isReported == true')
                ),
              S.listItem()
                .title("Comments")
                .child(
                  S.documentTypeList("comment")
                    .title("Reported Comments")
                    .filter('_type == "comment" && isReported == true')
                ),
              S.listItem()
                .title("Users")
                .child(
                  S.documentTypeList("user")
                    .title("Reported Users")
                    .filter('_type == "user" && isReported == true')
                    .child((userId) =>
                      S.list()
                        .title("User Options")
                        .items([
                          S.listItem()
                            .title("User Details")
                            .child(
                              S.document().schemaType("user").documentId(userId)
                            ),
                          S.listItem()
                            .title("Reported Posts by this user")
                            .child(
                              S.documentList()
                                .title("Reported Posts")
                                .filter(
                                  '_type == "post" && author._ref == $userId && isReported == true'
                                )
                                .params({ userId })
                            ),
                        ])
                    )
                ),
            ])
        ),
    ]);
