CREATE TYPE "invitation_status" AS ENUM('PENDING', 'ACCEPTED', 'EXPIRED', 'REVOKED');--> statement-breakpoint
ALTER TYPE "user_role" RENAME TO "member_role";--> statement-breakpoint
CREATE TABLE "invitations" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"tenant_id" uuid NOT NULL,
	"invited_by_user_id" uuid NOT NULL,
	"email" text NOT NULL,
	"role" "member_role" DEFAULT 'ANALYST'::"member_role" NOT NULL,
	"token" text NOT NULL UNIQUE,
	"status" "invitation_status" DEFAULT 'PENDING'::"invitation_status" NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"accepted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tenant_members" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"tenant_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" "member_role" DEFAULT 'ANALYST'::"member_role" NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_tenant_id_tenants_id_fkey";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_tenant_id_tenants_id_fkey";--> statement-breakpoint
DROP INDEX "users_tenant_email_unique";--> statement-breakpoint
DROP INDEX "users_tenant_id_index";--> statement-breakpoint
DROP INDEX "sessions_tenant_id_index";--> statement-breakpoint
ALTER TABLE "audit_logs" ADD COLUMN "entity" text NOT NULL;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD COLUMN "entity_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD COLUMN "ip_address" text;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD COLUMN "user_agent" text;--> statement-breakpoint
ALTER TABLE "sessions" DROP COLUMN "tenant_id";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "tenant_id";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "role";--> statement-breakpoint
CREATE INDEX "audit_logs_entity_index" ON "audit_logs" ("entity","entity_id");--> statement-breakpoint
CREATE UNIQUE INDEX "tenant_members_tenant_user_unique" ON "tenant_members" ("tenant_id","user_id") WHERE deleted_at IS NULL;--> statement-breakpoint
CREATE INDEX "tenant_members_tenant_id_index" ON "tenant_members" ("tenant_id");--> statement-breakpoint
CREATE INDEX "tenant_members_user_id_index" ON "tenant_members" ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_unique" ON "users" ("email") WHERE deleted_at IS NULL;--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_tenant_id_tenants_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id");--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_invited_by_user_id_users_id_fkey" FOREIGN KEY ("invited_by_user_id") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "tenant_members" ADD CONSTRAINT "tenant_members_tenant_id_tenants_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id");--> statement-breakpoint
ALTER TABLE "tenant_members" ADD CONSTRAINT "tenant_members_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id");