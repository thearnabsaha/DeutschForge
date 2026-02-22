CREATE TABLE "ai_insights" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"strengths" jsonb NOT NULL,
	"weaknesses" jsonb NOT NULL,
	"recommendations" jsonb NOT NULL,
	"data_points" integer NOT NULL,
	"generated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "card_states" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"card_id" text NOT NULL,
	"stability" real DEFAULT 0 NOT NULL,
	"difficulty" real DEFAULT 0 NOT NULL,
	"elapsed_days" real DEFAULT 0 NOT NULL,
	"scheduled_days" real DEFAULT 0 NOT NULL,
	"reps" integer DEFAULT 0 NOT NULL,
	"lapses" integer DEFAULT 0 NOT NULL,
	"state" integer DEFAULT 0 NOT NULL,
	"last_review" timestamp,
	"next_review" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cards" (
	"id" text PRIMARY KEY NOT NULL,
	"deck_id" text NOT NULL,
	"front" text NOT NULL,
	"back" text NOT NULL,
	"context_sentence" text,
	"explanation" text,
	"cefr_level" text NOT NULL,
	"module" text NOT NULL,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "conversation_messages" (
	"id" text PRIMARY KEY NOT NULL,
	"session_id" text NOT NULL,
	"role" text NOT NULL,
	"content" text NOT NULL,
	"translation" text,
	"corrections" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "conversation_sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"topic" text,
	"cefr_level" text DEFAULT 'A1' NOT NULL,
	"fluency_score" real,
	"accuracy_score" real,
	"vocabulary_score" real,
	"message_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"ended_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "decks" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"cefr_level" text NOT NULL,
	"module" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exam_attempts" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"template_id" text NOT NULL,
	"cefr_level" text NOT NULL,
	"total_score" real,
	"max_score" real,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp,
	"status" text DEFAULT 'in_progress' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exam_section_scores" (
	"id" text PRIMARY KEY NOT NULL,
	"attempt_id" text NOT NULL,
	"section" text NOT NULL,
	"score" real,
	"max_score" real NOT NULL,
	"answers" jsonb,
	"feedback" jsonb,
	"question_snapshot" jsonb,
	"time_spent" integer,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "exam_template_sections" (
	"id" text PRIMARY KEY NOT NULL,
	"template_id" text NOT NULL,
	"section" text NOT NULL,
	"time_minutes" integer NOT NULL,
	"instructions" text NOT NULL,
	"content" jsonb NOT NULL,
	"max_score" integer NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exam_templates" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"cefr_level" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "grammar_attempts" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"topic_id" text NOT NULL,
	"score" real NOT NULL,
	"max_score" real NOT NULL,
	"answers" jsonb NOT NULL,
	"completed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "grammar_topics" (
	"id" text PRIMARY KEY NOT NULL,
	"cefr_level" text NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"description" text NOT NULL,
	"theory" text NOT NULL,
	"examples" jsonb NOT NULL,
	"exercises" jsonb NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reminders" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"type" text NOT NULL,
	"message" text NOT NULL,
	"read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "review_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"card_id" text NOT NULL,
	"rating" integer NOT NULL,
	"state" integer NOT NULL,
	"stability" real NOT NULL,
	"difficulty" real NOT NULL,
	"elapsed" real NOT NULL,
	"scheduled" real NOT NULL,
	"reviewed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_settings" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"theme" text DEFAULT 'system' NOT NULL,
	"focus_mode" boolean DEFAULT false NOT NULL,
	"daily_goal" integer DEFAULT 20 NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_words" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"word" text NOT NULL,
	"part_of_speech" text NOT NULL,
	"gender" text,
	"plural_form" text,
	"conjugation" jsonb,
	"meaning" text NOT NULL,
	"cefr_level" text DEFAULT 'A1' NOT NULL,
	"example_sentence" text,
	"verb_type" text,
	"auxiliary_type" text,
	"present_form" text,
	"simple_past" text,
	"perfect_form" text,
	"learned" boolean DEFAULT false NOT NULL,
	"batch_id" text,
	"stability" real DEFAULT 0 NOT NULL,
	"difficulty" real DEFAULT 0 NOT NULL,
	"scheduled_days" real DEFAULT 0 NOT NULL,
	"reps" integer DEFAULT 0 NOT NULL,
	"lapses" integer DEFAULT 0 NOT NULL,
	"state" integer DEFAULT 0 NOT NULL,
	"last_review" timestamp,
	"next_review" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"username" text DEFAULT '' NOT NULL,
	"password_hash" text DEFAULT '' NOT NULL,
	"name" text DEFAULT 'Learner' NOT NULL,
	"target_level" text DEFAULT 'A1' NOT NULL,
	"timezone" text DEFAULT 'Europe/Berlin' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"xp" integer DEFAULT 0 NOT NULL,
	"level" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "word_batch_exams" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"batch_id" text NOT NULL,
	"score" real NOT NULL,
	"max_score" real NOT NULL,
	"vocab_accuracy" real,
	"gender_accuracy" real,
	"verb_accuracy" real,
	"time_spent" integer,
	"answers" jsonb NOT NULL,
	"completed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "word_batches" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"word_count" integer DEFAULT 0 NOT NULL,
	"learned_count" integer DEFAULT 0 NOT NULL,
	"practice_unlocked" boolean DEFAULT false NOT NULL,
	"exam_unlocked" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "word_review_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"word_id" text NOT NULL,
	"mode" text NOT NULL,
	"rating" integer NOT NULL,
	"correct" boolean NOT NULL,
	"reviewed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ai_insights" ADD CONSTRAINT "ai_insights_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "card_states" ADD CONSTRAINT "card_states_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "card_states" ADD CONSTRAINT "card_states_card_id_cards_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."cards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cards" ADD CONSTRAINT "cards_deck_id_decks_id_fk" FOREIGN KEY ("deck_id") REFERENCES "public"."decks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation_messages" ADD CONSTRAINT "conversation_messages_session_id_conversation_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."conversation_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation_sessions" ADD CONSTRAINT "conversation_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_attempts" ADD CONSTRAINT "exam_attempts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_attempts" ADD CONSTRAINT "exam_attempts_template_id_exam_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."exam_templates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_section_scores" ADD CONSTRAINT "exam_section_scores_attempt_id_exam_attempts_id_fk" FOREIGN KEY ("attempt_id") REFERENCES "public"."exam_attempts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_template_sections" ADD CONSTRAINT "exam_template_sections_template_id_exam_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."exam_templates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "grammar_attempts" ADD CONSTRAINT "grammar_attempts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "grammar_attempts" ADD CONSTRAINT "grammar_attempts_topic_id_grammar_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."grammar_topics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reminders" ADD CONSTRAINT "reminders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_logs" ADD CONSTRAINT "review_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_logs" ADD CONSTRAINT "review_logs_card_id_cards_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."cards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_words" ADD CONSTRAINT "user_words_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "word_batch_exams" ADD CONSTRAINT "word_batch_exams_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "word_batch_exams" ADD CONSTRAINT "word_batch_exams_batch_id_word_batches_id_fk" FOREIGN KEY ("batch_id") REFERENCES "public"."word_batches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "word_batches" ADD CONSTRAINT "word_batches_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "word_review_logs" ADD CONSTRAINT "word_review_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "word_review_logs" ADD CONSTRAINT "word_review_logs_word_id_user_words_id_fk" FOREIGN KEY ("word_id") REFERENCES "public"."user_words"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ai_insights_user_idx" ON "ai_insights" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "card_states_user_card_uniq" ON "card_states" USING btree ("user_id","card_id");--> statement-breakpoint
CREATE INDEX "card_states_user_next_review_idx" ON "card_states" USING btree ("user_id","next_review");--> statement-breakpoint
CREATE INDEX "card_states_user_state_idx" ON "card_states" USING btree ("user_id","state");--> statement-breakpoint
CREATE INDEX "cards_level_module_idx" ON "cards" USING btree ("cefr_level","module");--> statement-breakpoint
CREATE INDEX "cards_deck_idx" ON "cards" USING btree ("deck_id");--> statement-breakpoint
CREATE INDEX "conv_messages_session_idx" ON "conversation_messages" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "conv_sessions_user_idx" ON "conversation_sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "exam_attempts_user_started_idx" ON "exam_attempts" USING btree ("user_id","started_at");--> statement-breakpoint
CREATE UNIQUE INDEX "ess_attempt_section_uniq" ON "exam_section_scores" USING btree ("attempt_id","section");--> statement-breakpoint
CREATE INDEX "ets_template_section_idx" ON "exam_template_sections" USING btree ("template_id","section");--> statement-breakpoint
CREATE INDEX "grammar_attempts_user_topic_idx" ON "grammar_attempts" USING btree ("user_id","topic_id");--> statement-breakpoint
CREATE UNIQUE INDEX "grammar_topics_level_slug_uniq" ON "grammar_topics" USING btree ("cefr_level","slug");--> statement-breakpoint
CREATE INDEX "grammar_topics_level_idx" ON "grammar_topics" USING btree ("cefr_level");--> statement-breakpoint
CREATE INDEX "reminders_user_idx" ON "reminders" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "review_logs_user_reviewed_idx" ON "review_logs" USING btree ("user_id","reviewed_at");--> statement-breakpoint
CREATE INDEX "review_logs_card_idx" ON "review_logs" USING btree ("card_id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_settings_user_uniq" ON "user_settings" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_words_user_idx" ON "user_words" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_words_next_review_idx" ON "user_words" USING btree ("user_id","next_review");--> statement-breakpoint
CREATE INDEX "user_words_pos_idx" ON "user_words" USING btree ("user_id","part_of_speech");--> statement-breakpoint
CREATE UNIQUE INDEX "users_username_uniq" ON "users" USING btree ("username");--> statement-breakpoint
CREATE INDEX "wbe_user_batch_idx" ON "word_batch_exams" USING btree ("user_id","batch_id");--> statement-breakpoint
CREATE INDEX "word_batches_user_idx" ON "word_batches" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "word_review_user_idx" ON "word_review_logs" USING btree ("user_id","reviewed_at");