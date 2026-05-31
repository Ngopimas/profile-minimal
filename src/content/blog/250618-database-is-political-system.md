---
author: Romain C.
pubDatetime: 2025-06-18T10:00:00Z
title: "Your database is a political system"
slug: database-is-political-system
featured: false
draft: false
tags: ["database", "postgresql", "schema-design", "software-engineering", "governance"]
description: "Constitution, legislature, judiciary, black market. Everyone sees it. Nobody names it."
---

Every database has a constitution. Most teams do not realize they are living under one.

The schema is the foundational law. It defines what can exist and what cannot. A `users` table with columns `id`, `email`, `created_at` is a declaration: users have emails, emails are required, and we do not store phone numbers. That is a political decision dressed as a migration.

Every database also has a legislature. Migrations change the schema over time. They add columns, create new tables, remove deprecated fields. Each migration is a law that changes what the system considers valid. When two branches modify the same table at the same time, that is legislative gridlock. Somebody has to resolve the conflict before either law passes.

Then there is the judiciary. Constraints enforce the law. A foreign key says "this relationship must exist". A unique constraint says "no duplicates". A check constraint says "this value must be positive". A NOT NULL says "this field is not optional". The database enforces these even when the application forgets.

And every database has a black market. Raw SQL that bypasses the ORM. Manual updates in production. A script somebody wrote once to fix data and nobody documented. A spreadsheet that shadows the official schema. The black market exists because the official process is too slow, too restrictive, or too broken.

Everyone recognizes these roles. Nobody names them. Once you name them, you can govern the system instead of being governed by it.

## The constitution (schema)

A schema is not a technical artifact. It is an argument about what the system considers real.

Look at your `users` table. Does it have a `full_name` column? That means the system thinks a user has one name. Does it split into `first_name` and `last_name`? That means the system thinks names decompose that way. Does it have a `username`? That means the system thinks users need an identity distinct from their email.

These are not neutral decisions. They encode assumptions about your users. When a user from Japan complains that the form requires a last name, that is a constitutional problem. The schema said last names exist. They do not, or at least not the way the schema assumes.

I review schemas the way I review code, but with different questions. Not "does this work" but "what does this believe about the world".

## The legislature (migrations)

Migrations are law-making. They change what is allowed.

A good migration is small, reversible, and has a reason. "Add column `preferred_currency` to `users`" is good. "Refactor entire payments schema" is a constitutional amendment. Constitutional amendments should be rare and well-documented.

Migration conflicts are interesting. Two developers modify the same table. Git detects the conflict. Somebody has to decide which change takes priority or whether they merge cleanly. This is exactly what happens in a legislature when two bills modify the same legal code.

I have seen teams treat migrations as an afterthought. They run `makemigrations` without reviewing the output. They deploy on Friday. A migration locks a table for 45 minutes and takes the site down. That is a law that passed without debate.

The fix is the same as in actual legislation: review before passing, deploy when you can handle the consequences, and have a rollback plan.

## The judiciary (constraints)

Constraints are the only part of the database that enforces its own rules.

The application layer has opinions. The schema has structure. But the constraints are the judiciary. They do not care about your application logic. They do not care about your migrations. A NOT NULL constraint rejects a null value even if your code sends one. A unique constraint rejects a duplicate even if your code thinks it is creating something new.

I used to put all validation in the application. Type checks, business rules, input sanitization. That works until it does not. A bug in the application layer can insert invalid data. The database is the last line of defense.

Now I put critical rules in the database. If a column must not be null, a NOT NULL constraint enforces it. If two tables have a relationship, a foreign key enforces it. If a value has a range, a check constraint enforces it.

The application handles user experience. The database handles truth.

## The black market (raw SQL)

Every team has a black market. I have never seen an exception.

A developer runs a manual UPDATE to fix production data. A data analyst writes a query that bypasses the API. Someone maintains a script that patches records the official migration did not handle. A spreadsheet tracks state that should be in the database.

The black market exists because the official process has friction. Filing a migration ticket takes two days. The bug is live now. Running a manual query takes two minutes. The developer runs the query.

This is not a discipline problem. It is a process problem. If the official channel is too slow, people will use unofficial channels. If the migration process is painful, people will skip it.

The fix is making the official process faster. A migration that takes five minutes to create and deploy gets used. A migration that requires a Jira ticket, a code review, and a deployment window gets worked around.

## Healthy political systems

A healthy database has clear roles. The schema is the agreed-upon structure. Migrations are reviewed before they deploy. Constraints enforce the rules that matter. The black market is small because the official process works.

An unhealthy database has a schema nobody understands, migrations that nobody reviews, constraints that do not exist, and a black market that is larger than the official system.

The health of a database is not measured by uptime or query speed. It is measured by how well the political system functions. Can you explain why the schema looks this way? Can you trace a column back to the migration that added it? Can you name what the constraints protect? Can you list the manual scripts that run outside the migration system?

If you can answer those questions, the system is governed. If you cannot, the system is governing you.
