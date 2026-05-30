-- Create "link_analytics" table
CREATE TABLE "link_analytics" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "link_id" uuid NOT NULL,
  "click_count" bigint NULL DEFAULT 0,
  "created_at" timestamptz NULL,
  "updated_at" timestamptz NULL,
  PRIMARY KEY ("id")
);
-- Create index "idx_link_analytics_link_id" to table: "link_analytics"
CREATE INDEX "idx_link_analytics_link_id" ON "link_analytics" ("link_id");
-- Create "link_click_events" table
CREATE TABLE "link_click_events" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "link_id" uuid NOT NULL,
  "country" character varying(100) NULL,
  "city" character varying(100) NULL,
  "browser" character varying(100) NULL,
  "os" character varying(100) NULL,
  "device" character varying(100) NULL,
  "referrer" text NULL,
  "clicked_at" timestamptz NULL,
  PRIMARY KEY ("id")
);
-- Create index "idx_link_click_events_clicked_at" to table: "link_click_events"
CREATE INDEX "idx_link_click_events_clicked_at" ON "link_click_events" ("clicked_at");
-- Create index "idx_link_click_events_link_id" to table: "link_click_events"
CREATE INDEX "idx_link_click_events_link_id" ON "link_click_events" ("link_id");
-- Create "link_stats" table
CREATE TABLE "link_stats" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "link_id" uuid NOT NULL,
  "total_clicks" bigint NULL DEFAULT 0,
  "created_at" timestamptz NULL,
  "updated_at" timestamptz NULL,
  PRIMARY KEY ("id")
);
-- Create index "idx_link_stats_link_id" to table: "link_stats"
CREATE UNIQUE INDEX "idx_link_stats_link_id" ON "link_stats" ("link_id");
-- Create "links" table
CREATE TABLE "links" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "title" character varying(255) NOT NULL,
  "description" text NULL,
  "url" text NOT NULL,
  "icon_url" text NULL,
  "position" bigint NULL DEFAULT 0,
  "is_active" boolean NULL DEFAULT false,
  "created_at" timestamptz NULL,
  "updated_at" timestamptz NULL,
  PRIMARY KEY ("id")
);
-- Create index "idx_links_user_id" to table: "links"
CREATE INDEX "idx_links_user_id" ON "links" ("user_id");
-- Create "profiles" table
CREATE TABLE "profiles" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "username" character varying(32) NOT NULL,
  "display_name" character varying(100) NULL,
  "bio" text NULL,
  "avatar_url" text NULL,
  "theme" character varying(50) NULL DEFAULT 'default',
  "is_public" boolean NULL DEFAULT true,
  "created_at" timestamptz NULL,
  "updated_at" timestamptz NULL,
  PRIMARY KEY ("id")
);
-- Create index "idx_profiles_user_id" to table: "profiles"
CREATE UNIQUE INDEX "idx_profiles_user_id" ON "profiles" ("user_id");
-- Create index "idx_profiles_username" to table: "profiles"
CREATE UNIQUE INDEX "idx_profiles_username" ON "profiles" ("username");
-- Create "sessions" table
CREATE TABLE "sessions" (
  "id" character varying(255) NOT NULL,
  "user_id" uuid NOT NULL,
  "provider" character varying(20) NOT NULL,
  "ip_address" character varying(45) NULL,
  "user_agent" text NULL,
  "expires_at" timestamptz NOT NULL,
  "last_rotated_at" timestamptz NOT NULL,
  "created_at" timestamptz NULL,
  PRIMARY KEY ("id")
);
-- Create index "idx_sessions_expires_at" to table: "sessions"
CREATE INDEX "idx_sessions_expires_at" ON "sessions" ("expires_at");
-- Create index "idx_sessions_user_id" to table: "sessions"
CREATE INDEX "idx_sessions_user_id" ON "sessions" ("user_id");
-- Create "social_links" table
CREATE TABLE "social_links" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "profile_id" uuid NOT NULL,
  "platform" character varying(50) NULL,
  "url" text NULL,
  "created_at" timestamptz NULL,
  "updated_at" timestamptz NULL,
  PRIMARY KEY ("id")
);
-- Create index "idx_social_links_profile_id" to table: "social_links"
CREATE INDEX "idx_social_links_profile_id" ON "social_links" ("profile_id");
-- Create "temp_users" table
CREATE TABLE "temp_users" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "email" character varying(255) NOT NULL,
  "display_name" character varying(100) NULL,
  "avatar_url" text NULL,
  "provider" character varying(20) NULL DEFAULT 'email_otp',
  "is_expired" boolean NULL DEFAULT false,
  "created_at" timestamptz NULL,
  "updated_at" timestamptz NULL,
  PRIMARY KEY ("id")
);
-- Create index "idx_temp_users_email" to table: "temp_users"
CREATE UNIQUE INDEX "idx_temp_users_email" ON "temp_users" ("email");
-- Create "users" table
CREATE TABLE "users" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "username" character varying(32) NOT NULL,
  "email" character varying(255) NOT NULL,
  "password_hash" text NULL,
  "created_at" timestamptz NULL,
  "updated_at" timestamptz NULL,
  PRIMARY KEY ("id")
);
-- Create index "idx_users_email" to table: "users"
CREATE UNIQUE INDEX "idx_users_email" ON "users" ("email");
-- Create index "idx_users_username" to table: "users"
CREATE UNIQUE INDEX "idx_users_username" ON "users" ("username");
