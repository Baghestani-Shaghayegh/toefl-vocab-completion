-- Create users table
create table if not exists users (
  id uuid not null primary key references auth.users(id) on delete cascade,
  email text not null unique,
  first_name text,
  last_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on users table
alter table users enable row level security;

-- Create policy: users can read their own profile
create policy "Users can read their own profile" on users
  for select
  using (auth.uid() = id);

-- Create policy: users can update their own profile
create policy "Users can update their own profile" on users
  for update
  using (auth.uid() = id);

-- Create policy: new users can insert their own profile
create policy "Users can create their own profile" on users
  for insert
  with check (auth.uid() = id);

-- Create index on email for faster lookups
create index if not exists users_email_idx on users(email);