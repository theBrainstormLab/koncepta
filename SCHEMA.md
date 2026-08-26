# Database schema

Six tables in Supabase. All have Row Level Security enabled (see the
RLS notes under each table below).

## degrees

| column | type            |
| ------ | --------------- |
| id     | uuid            |
| name   | varchar, unique |

```sql
create table degrees (
  id uuid primary key default gen_random_uuid(),
  name varchar not null unique
);
```

**RLS:** public read only. Admin-managed, nothing in the app writes here.

## courses

| column     | type                                 |
| ---------- | ------------------------------------ |
| id         | uuid                                 |
| degree_id  | uuid, references degrees             |
| title      | varchar                              |
| code       | varchar, unique (`courses_code_key`) |
| created_at | timestamp                            |

```sql
create table courses (
  id uuid primary key default gen_random_uuid(),
  degree_id uuid not null references degrees(id) on delete cascade,
  title varchar not null,
  code varchar not null,
  created_at timestamp default now()
);
alter table courses add constraint courses_code_key unique (code);
```

**RLS:** public read only. Admin-managed, nothing in the app writes here.

`code` is the real-world course identifier used in URLs
(`/notes/<code>/<moduleId>`), hence the unique constraint.

## modules

Represents a topic within a course (e.g. "LinkedList" under "CS201 · DSA").
Multiple modules per course is expected and normal.

| column     | type                     |
| ---------- | ------------------------ |
| id         | uuid                     |
| course_id  | uuid, references courses |
| title      | varchar                  |
| created_at | timestamp                |
| verified   | boolean, default false   |

```sql
create table modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses(id) on delete cascade,
  title varchar not null,
  created_at timestamp default now(),
  verified boolean not null default false
);
```

**RLS:** public read; any signed-in user can insert (the note editor
creates a module on the fly when you type a new topic name -> see
`ensureModuleId` in `src/api/modules.js`). No update/delete policy yet.
`verified` is admin-set; the app only displays it.

## notes

Titles were removed from the product; the `title` column has been
dropped. A note is content attached to a module.

| column     | type                     |
| ---------- | ------------------------ |
| id         | uuid                     |
| module_id  | uuid, references modules |
| author_id  | uuid, references users   |
| content    | text                     |
| created_at | timestamp                |
| updated_at | timestamp                |

```sql
create table notes (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references modules(id) on delete cascade,
  author_id uuid not null references users(id) on delete cascade,
  content text not null,
  created_at timestamp default now(),
  updated_at timestamp default now()
);
```

**RLS:** public read; insert/update/delete restricted to
`auth.uid() = author_id`.

## note*contributors *(currently not in the app yet)\_

Join table, tracks who else contributed to a note besides the original author.

| column  | type                   |
| ------- | ---------------------- |
| note_id | uuid, references notes |
| user_id | uuid, references users |

```sql
create table note_contributors (
  note_id uuid not null references notes(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  primary key (note_id, user_id)
);
```

**RLS:** public read only. No insert/update/delete policy until the
collaborative-notes feature is actually built.

## users

Populated automatically on signup by a trigger
(`handle_new_user`, fires `after insert on auth.users`) -> this table is
never written to directly from client code except for username changes.
New users get a random username (e.g. `Rusty_Falcon_0417`).

| column     | type            |
| ---------- | --------------- |
| id         | uuid            |
| username   | varchar, unique |
| email      | varchar, unique |
| created_at | timestamp       |

```sql
create table users (
  id uuid primary key default gen_random_uuid(),
  username varchar not null unique,
  email varchar not null unique,
  created_at timestamp default now()
);
```

**RLS:** read access is restricted at the column level -- `anon` and
`authenticated` may select only `id, username, created_at`; `email` is
granted to no client role. A signed-in user's own email comes from the
auth session (`supabase.auth.getUser()` / `session.user.email`), never
from this table. Update restricted to `auth.uid() = id` (used by
the username-change flow). No client-side insert policy -> rows are only
ever created by the `handle_new_user` trigger, which runs as
`security definer` and bypasses RLS.
