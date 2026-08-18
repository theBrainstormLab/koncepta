# Database schema

Six tables in Supabase. All have Row Level Security enabled (see the
RLS notes under each table below).

## degrees

| column | type |
| ------ | ---- |
| id     | uuid |
| name   | text |

```sql
create table degrees (
  id uuid primary key default gen_random_uuid(),
  name text not null
);
```

**RLS:** public read only. Admin-managed, nothing in the app writes here.

## courses

| column     | type                     |
| ---------- | ------------------------ |
| id         | uuid                     |
| degree_id  | uuid, references degrees |
| title      | text                     |
| code       | text                     |
| created_at | timestamp                |

```sql
create table courses (
  id uuid primary key default gen_random_uuid(),
  degree_id uuid not null references degrees(id) on delete cascade,
  title text not null,
  code text not null,
  created_at timestamp with time zone default now()
);
```

**RLS:** public read only. Admin-managed, nothing in the app writes here.

## modules

Represents a topic within a course (e.g. "LinkedList" under "CS201 · DSA").
Multiple modules per course is expected and normal.

| column     | type                     |
| ---------- | ------------------------ |
| id         | uuid                     |
| course_id  | uuid, references courses |
| title      | text                     |
| created_at | timestamp                |

```sql
create table modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses(id) on delete cascade,
  title text not null,
  created_at timestamp with time zone default now()
);
```

**RLS:** public read; any signed-in user can insert (the note editor
creates a module on the fly when you type a new topic name -> see
`ensureModuleId` in `src/api/modules.js`). No update/delete policy yet.

## notes

| column     | type                     |
| ---------- | ------------------------ |
| id         | uuid                     |
| module_id  | uuid, references modules |
| author_id  | uuid, references users   |
| title      | text                     |
| content    | text                     |
| created_at | timestamp                |
| updated_at | timestamp                |

```sql
create table notes (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references modules(id) on delete cascade,
  author_id uuid not null references users(id) on delete cascade,
  title text not null,
  content text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

**RLS:** public read; insert/update/delete restricted to
`auth.uid() = author_id`.

## note_contributors *(currently not in the app yet)*

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

| column     | type      |
| ---------- | --------- |
| id         | uuid      |
| username   | text      |
| email      | text      |
| created_at | timestamp |

```sql
create table users (
  id uuid primary key default gen_random_uuid(),
  username text not null unique,
  email text not null unique,
  created_at timestamp with time zone default now()
);
```

**RLS:** public read; update restricted to `auth.uid() = id` (used by
the username-change flow). No client-side insert policy -> rows are only
ever created by the `handle_new_user` trigger, which runs as
`security definer` and bypasses RLS.
