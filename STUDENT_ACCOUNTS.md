# Student Accounts Architecture

The student account system is designed around Supabase Auth + PostgreSQL Row Level Security.

## Browser responsibilities

The GitHub Pages client may contain only the public Supabase project URL and public anon/publishable key. It must never contain a service-role key, database password or admin token.

The browser:
- signs up and signs in through Supabase Auth;
- receives the student's JWT session;
- reads only that student's `profiles` row;
- reads/writes only that student's `student_progress` row;
- keeps local progress as an offline cache.

## Database responsibilities

`profiles`
- one row per authenticated user;
- student-visible identity metadata;
- role defaults to `student`;
- RLS restricts reads/updates to the owner;
- clients cannot promote their own role.

`student_progress`
- one JSONB progress document per user;
- RLS restricts every operation to `auth.uid() = user_id`;
- `updated_at` supports conflict-safe synchronization.

## Sync policy

The client retains local storage so learning works even if the network is unavailable.

On sign-in:
1. fetch remote progress;
2. compare `updated_at`;
3. keep the newer document;
4. upload local state when local is newer;
5. load remote state when remote is newer.

After student changes, upload is debounced. This avoids a request per keystroke/checkpoint.

## Stable IDs

Progress schema v2 is keyed by stable topic IDs such as `L00.T01`, not by raw array-position keys like `0:1`. A migration converts existing local progress automatically.

These IDs are persistence contracts. Do not reuse an existing ID for a different concept.

## Deployment configuration

Fill `config/runtime.json` with the project's public URL and anon/publishable key:

```json
{
  "supabaseUrl": "https://PROJECT.supabase.co",
  "supabaseAnonKey": "PUBLIC_ANON_OR_PUBLISHABLE_KEY"
}
```

These values identify the public project and are not admin secrets. Security is enforced by Auth + RLS.

## Required Auth settings

Use email/password authentication. For production, email confirmation should stay enabled. Configure the Site URL and allowed redirect URLs for the final GitHub Pages/custom domain.

## Never do this

- do not commit a service-role key;
- do not disable RLS for convenience;
- do not trust a client-supplied `role`;
- do not key student progress by email;
- do not make progress rows publicly readable;
- do not couple authentication state to curriculum content.
