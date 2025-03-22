import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: './src/lib/db/schema.ts',
	out: './src/lib/db/drizzle',
	dialect: 'turso',
	dbCredentials: {
		url: process.env.DATABASE_URI!,
		authToken: process.env.DATABASE_AUTH_TOKEN!
	},
	casing: 'snake_case',
	verbose: true
});
