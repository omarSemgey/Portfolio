'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      router.push('/dashboard');
      router.refresh(); 
    } else {
      setError('Access Denied. Incorrect credentials.');
    }
  };

  return (
    <main className="bg-main px-4 md:px-8 dark:bg-neutral-900">
   <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="max-w-md w-full">
         <div
            className="p-6 rounded-lg bg-surface border border-slate-300 shadow-xs md:p-8 dark:border-neutral-700">
            <h1 className="text-slate-900 text-center text-3xl font-bold dark:text-slate-50">log in</h1>

            <form onSubmit={handleLogin} className="space-y-6 mt-10">
               <div>
                  <label 
                     className="mb-2 text-slate-900 font-medium text-sm inline-block dark:text-slate-50">username</label>
                  <input value={username} onChange={(e) => setUsername(e.target.value)} type="username" id="username" name="username" placeholder="Username" required
                     className="px-3 py-2.5 text-sm text-slate-900 rounded-md bg-white w-full outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:text-slate-50 dark:bg-neutral-700 dark:outline-neutral-600" />
               </div>
               <div>
                  <label 
                     className="mb-2 text-slate-900 font-medium text-sm inline-block dark:text-slate-50">Password</label>
                  <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" id="password" name="password" placeholder="Password" required
                     className="px-3 py-2.5 text-sm text-slate-900 rounded-md bg-white w-full outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 dark:text-slate-50 dark:bg-neutral-700 dark:outline-neutral-600" />
               </div>
               <button type="submit"
                  className="w-full py-2 px-3.5 text-sm rounded-md font-semibold cursor-pointer tracking-wide text-white border border-primary bg-primary  hover:bg- transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                  Sign in</button>
            </form>
         </div>
      </div>
   </div>
</main>
  );
}