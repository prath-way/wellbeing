# HealthConnect Authentication Setup Guide

## 🚀 Quick Setup

### 1. Install Dependencies
The Supabase client has been added to your project. If you need to reinstall:
```bash
npm install @supabase/supabase-js
```

### 2. Environment Configuration
1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Update `.env.local` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### 3. Supabase Project Setup
1. Go to [supabase.com](https://supabase.com) and create a new project
2. In your Supabase dashboard:
   - Go to Settings → API
   - Copy your Project URL and anon/public key
   - Paste them into your `.env.local` file

### 4. Database Schema (Optional)
If you want to store additional user profile data, create this table in Supabase SQL Editor:

```sql
-- Create profiles table
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  first_name text,
  last_name text,
  full_name text,
  phone text,
  date_of_birth date,
  avatar_url text,
  
  constraint profiles_first_name_length check (char_length(first_name) >= 1),
  constraint profiles_last_name_length check (char_length(last_name) >= 1)
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

-- Create policy for users to see their own profile
create policy "Users can view own profile." 
  on profiles for select 
  using ( auth.uid() = id );

-- Create policy for users to update their own profile
create policy "Users can update own profile." 
  on profiles for update 
  using ( auth.uid() = id );

-- Create policy for users to insert their own profile
create policy "Users can insert own profile." 
  on profiles for insert 
  with check ( auth.uid() = id );

-- Function to automatically create profile on signup
create function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, full_name, first_name, last_name, phone, date_of_birth)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->>'phone',
    (new.raw_user_meta_data->>'date_of_birth')::date
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function on user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

## 🔧 What's Been Added

### Files Created:
- `src/lib/supabase.ts` - Supabase client configuration
- `src/contexts/AuthContext.tsx` - Authentication context and hooks
- `src/pages/Login.tsx` - Login page with form validation
- `src/pages/Signup.tsx` - Signup page with user registration
- `src/components/ProtectedRoute.tsx` - Route protection wrapper

### Files Modified:
- `src/App.tsx` - Added auth provider and protected routes
- `src/components/Navigation.tsx` - Added auth state and sign out functionality

## 🎯 Features Included

### Authentication Features:
- ✅ User registration with email/password
- ✅ User login with email/password
- ✅ Email verification (automatic with Supabase)
- ✅ Password validation
- ✅ Protected routes
- ✅ Automatic redirect after login
- ✅ Sign out functionality
- ✅ Loading states
- ✅ Error handling
- ✅ Mobile-responsive design

### UI/UX Features:
- ✅ Beautiful login/signup forms
- ✅ Password visibility toggle
- ✅ Form validation with error messages
- ✅ Success states
- ✅ Social login placeholders (Google, Facebook)
- ✅ Terms and privacy policy links
- ✅ Responsive navigation updates

## 🔒 Security Features

- **Row Level Security (RLS)** - Users can only access their own data
- **Email verification** - Users must verify email before accessing protected routes
- **Protected routes** - Authenticated users only
- **Secure password handling** - Handled by Supabase Auth
- **Environment variables** - Sensitive keys stored securely

## 🎨 Customization Options

### Styling:
- All components use your existing design system
- Consistent with HealthConnect branding
- Fully responsive design
- Dark/light mode compatible

### Social Authentication (Optional):
To enable Google/Facebook login, configure providers in Supabase:
1. Go to Authentication → Providers
2. Enable desired providers
3. Add OAuth credentials
4. Update the social login buttons in Login.tsx and Signup.tsx

## 🚦 Usage

### Using the Auth Context:
```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, signOut, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      {user ? (
        <div>
          <p>Welcome, {user.email}!</p>
          <button onClick={signOut}>Sign Out</button>
        </div>
      ) : (
        <p>Please sign in</p>
      )}
    </div>
  );
}
```

### Protecting Routes:
```tsx
import ProtectedRoute from '@/components/ProtectedRoute';

<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />
```

## 🐛 Troubleshooting

### Common Issues:
1. **Environment variables not loading**: Make sure `.env.local` is in the root directory
2. **CORS errors**: Check your Supabase project URL is correct
3. **Email not sending**: Verify email templates in Supabase Auth settings
4. **Users can't sign up**: Check if email confirmations are required in Auth settings

### Development Tips:
- Use Supabase Auth logs to debug authentication issues
- Test email flows in development mode
- Check browser network tab for API errors
- Verify RLS policies if data access issues occur

## 🎉 Next Steps

Your authentication system is now ready! Users can:
1. Sign up for new accounts
2. Sign in to existing accounts
3. Access protected routes
4. Sign out securely

Consider adding:
- Password reset functionality
- Profile management pages
- Email preferences
- Two-factor authentication
- Social login providers
