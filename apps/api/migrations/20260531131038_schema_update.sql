-- Modify "links" table
ALTER TABLE "links" ADD CONSTRAINT "fk_links_user" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON UPDATE NO ACTION ON DELETE CASCADE;
-- Modify "link_analytics" table
ALTER TABLE "link_analytics" ADD CONSTRAINT "fk_link_analytics_link" FOREIGN KEY ("link_id") REFERENCES "links" ("id") ON UPDATE NO ACTION ON DELETE CASCADE;
-- Modify "link_click_events" table
ALTER TABLE "link_click_events" ADD CONSTRAINT "fk_link_click_events_link" FOREIGN KEY ("link_id") REFERENCES "links" ("id") ON UPDATE NO ACTION ON DELETE CASCADE;
-- Modify "link_stats" table
ALTER TABLE "link_stats" ADD CONSTRAINT "fk_link_stats_link" FOREIGN KEY ("link_id") REFERENCES "links" ("id") ON UPDATE NO ACTION ON DELETE CASCADE;
-- Modify "profiles" table
ALTER TABLE "profiles" ADD CONSTRAINT "fk_profiles_user" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON UPDATE NO ACTION ON DELETE CASCADE;
-- Modify "sessions" table
ALTER TABLE "sessions" ADD CONSTRAINT "fk_sessions_user" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON UPDATE NO ACTION ON DELETE CASCADE;
-- Modify "social_links" table
ALTER TABLE "social_links" ADD CONSTRAINT "fk_social_links_profile" FOREIGN KEY ("profile_id") REFERENCES "profiles" ("id") ON UPDATE NO ACTION ON DELETE CASCADE;
