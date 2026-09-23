-- Security and performance hardening for student-account RLS.
revoke all on function public.handle_new_student() from public;
revoke execute on function public.handle_new_student() from anon;
revoke execute on function public.handle_new_student() from authenticated;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles for select
using ((select auth.uid()) = user_id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles for update
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "progress_select_own" on public.student_progress;
create policy "progress_select_own"
on public.student_progress for select
using ((select auth.uid()) = user_id);

drop policy if exists "progress_insert_own" on public.student_progress;
create policy "progress_insert_own"
on public.student_progress for insert
with check ((select auth.uid()) = user_id);

drop policy if exists "progress_update_own" on public.student_progress;
create policy "progress_update_own"
on public.student_progress for update
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
