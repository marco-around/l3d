import type { db } from '@l3d/database/client'

export const DRIZZLE_CONNECTION = 'DRIZZLE_CONNECTION'
export const REDIS_CONNECTION = 'REDIS_CONNECTION'
export type DrizzleDb = typeof db
