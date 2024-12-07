/* tslint:disable */
/* eslint-disable */
/**
 * This file was automatically generated by Payload.
 * DO NOT MODIFY IT BY HAND. Instead, modify your source Payload config,
 * and re-run `payload generate:types` to regenerate this file.
 */

/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "SharedMetaArray".
 */
export type SharedMetaArray =
  | {
      title?: string | null;
      description?: string | null;
      id?: string | null;
    }[]
  | null;

export interface Config {
  auth: {
    users: UserAuthOperations;
  };
  collections: {
    collection1: Collection1;
    collection2: Collection2;
    'no-graphql': NoGraphql;
    users: User;
    'payload-locked-documents': PayloadLockedDocument;
    'payload-preferences': PayloadPreference;
    'payload-migrations': PayloadMigration;
  };
  collectionsJoins: {};
  collectionsSelect: {
    collection1: Collection1Select<false> | Collection1Select<true>;
    collection2: Collection2Select<false> | Collection2Select<true>;
    'no-graphql': NoGraphqlSelect<false> | NoGraphqlSelect<true>;
    users: UsersSelect<false> | UsersSelect<true>;
    'payload-locked-documents': PayloadLockedDocumentsSelect<false> | PayloadLockedDocumentsSelect<true>;
    'payload-preferences': PayloadPreferencesSelect<false> | PayloadPreferencesSelect<true>;
    'payload-migrations': PayloadMigrationsSelect<false> | PayloadMigrationsSelect<true>;
  };
  db: {
    defaultIDType: string;
  };
  globals: {};
  globalsSelect: {};
  locale: null;
  user: User & {
    collection: 'users';
  };
  jobs: {
    tasks: unknown;
    workflows: unknown;
  };
  /**
   * typescript.typeSafeDepth is not enabled
   */
  depth: {
    allowed: number;
    decremented: number[];
    default: number;
  };
}
export interface UserAuthOperations {
  forgotPassword: {
    email: string;
    password: string;
  };
  login: {
    email: string;
    password: string;
  };
  registerFirstUser: {
    email: string;
    password: string;
  };
  unlock: {
    email: string;
    password: string;
  };
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "collection1".
 */
export interface Collection1 {
  id: string;
  testing: string;
  title: string;
  meta?: SharedMetaArray;
  blocks: (SharedMetaBlock | AnotherSharedBlock)[];
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "SharedMetaBlock".
 */
export interface SharedMetaBlock {
  b1title: string;
  b1description?: string | null;
  id?: string | null;
  blockName?: string | null;
  blockType: 'block1';
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "AnotherSharedBlock".
 */
export interface AnotherSharedBlock {
  b2title: string;
  b2description?: string | null;
  id?: string | null;
  blockName?: string | null;
  blockType: 'block2';
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "collection2".
 */
export interface Collection2 {
  id: string;
  metaArray?: SharedMetaArray;
  metaGroup?: SharedMeta;
  nestedGroup?: {
    meta?: SharedMeta;
  };
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "SharedMeta".
 */
export interface SharedMeta {
  title?: string | null;
  description?: string | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "no-graphql".
 */
export interface NoGraphql {
  id: string;
  name?: string | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "users".
 */
export interface User {
  id: string;
  updatedAt: string;
  createdAt: string;
  email: string;
  resetPasswordToken?: string | null;
  resetPasswordExpiration?: string | null;
  salt?: string | null;
  hash?: string | null;
  loginAttempts?: number | null;
  lockUntil?: string | null;
  password?: string | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-locked-documents".
 */
export interface PayloadLockedDocument {
  id: string;
  document?:
    | ({
        relationTo: 'collection1';
        value: string | Collection1;
      } | null)
    | ({
        relationTo: 'collection2';
        value: string | Collection2;
      } | null)
    | ({
        relationTo: 'no-graphql';
        value: string | NoGraphql;
      } | null)
    | ({
        relationTo: 'users';
        value: string | User;
      } | null);
  globalSlug?: string | null;
  user: {
    relationTo: 'users';
    value: string | User;
  };
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-preferences".
 */
export interface PayloadPreference {
  id: string;
  user: {
    relationTo: 'users';
    value: string | User;
  };
  key?: string | null;
  value?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-migrations".
 */
export interface PayloadMigration {
  id: string;
  name?: string | null;
  batch?: number | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "collection1_select".
 */
export interface Collection1Select<T extends boolean = true> {
  testing?: T;
  title?: T;
  meta?:
    | T
    | {
        title?: T;
        description?: T;
        id?: T;
      };
  blocks?:
    | T
    | {
        block1?:
          | T
          | {
              b1title?: T;
              b1description?: T;
              id?: T;
              blockName?: T;
            };
        block2?:
          | T
          | {
              b2title?: T;
              b2description?: T;
              id?: T;
              blockName?: T;
            };
      };
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "collection2_select".
 */
export interface Collection2Select<T extends boolean = true> {
  metaArray?:
    | T
    | {
        title?: T;
        description?: T;
        id?: T;
      };
  metaGroup?:
    | T
    | {
        title?: T;
        description?: T;
      };
  nestedGroup?:
    | T
    | {
        meta?:
          | T
          | {
              title?: T;
              description?: T;
            };
      };
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "no-graphql_select".
 */
export interface NoGraphqlSelect<T extends boolean = true> {
  name?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "users_select".
 */
export interface UsersSelect<T extends boolean = true> {
  updatedAt?: T;
  createdAt?: T;
  email?: T;
  resetPasswordToken?: T;
  resetPasswordExpiration?: T;
  salt?: T;
  hash?: T;
  loginAttempts?: T;
  lockUntil?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-locked-documents_select".
 */
export interface PayloadLockedDocumentsSelect<T extends boolean = true> {
  document?: T;
  globalSlug?: T;
  user?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-preferences_select".
 */
export interface PayloadPreferencesSelect<T extends boolean = true> {
  user?: T;
  key?: T;
  value?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-migrations_select".
 */
export interface PayloadMigrationsSelect<T extends boolean = true> {
  name?: T;
  batch?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "auth".
 */
export interface Auth {
  [k: string]: unknown;
}


declare module 'payload' {
  // @ts-ignore 
  export interface GeneratedTypes extends Config {}
}