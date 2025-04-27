import { sanityFetch } from '../live'
// import { defineQuery } from 'next-sanity'
import { defineQuery } from 'groq'

export async function getSubverses() {
  const getSubversesQuery = defineQuery(`
    *[_type == "subverse"] | order(createdAt desc) {
      _id,
      title,
      "slug": slug.current,
      description,
      image,
      "moderator": moderator->,
      createdAt
    }
  `)

  const subverses = await sanityFetch({ query: getSubversesQuery })
  return subverses.data
}
