import { type SchemaTypeDefinition } from 'sanity'
import { userType } from './userType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [userType],
}
