# Koncepta

A place for community-written notes, with an AI chat alongside each one to help you understand it.

Built mainly for _FYUGP students at Calicut University_, since the new curriculum is confusing and good notes are hard to find. But it's just notes underneath, so _anyone_ can use it for anything.

## Features

- **Notes are Markdown**, written by whoever posts them. Anyone can contribute to a note, not just the original author.
- **AI chat per note**, optional. A small side panel if you want to ask something about the note you're reading.

## Build it yourself

### Prerequisites

- [Bun](https://bun.sh/)
- A [Supabase](https://supabase.com/) project

### Setup

1. Clone the repo:

   ```bash
   git clone https://github.com/theBrainstormLab/koncepta.git
   cd koncepta
   ```

2. Install dependencies:

   ```bash
   bun install
   ```

3. Copy the environment example and fill in your Supabase credentials:

   ```bash
   cp .env.example .env
   ```

4. Start the dev server:

   ```bash
   bun run dev
   ```

## Database

Supabase, more info in [SCHEMA.md](SCHEMA.md).

## Contributing

PRs and issues are always welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

[MIT](LICENSE)
