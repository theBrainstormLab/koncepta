# Database schema

Six tables in Supabase.

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

## modules

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

## note_contributors

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

## users

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
