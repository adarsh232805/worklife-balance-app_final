'use client';

import { useState, useTransition } from 'react';
import { authenticate, register } from '@/lib/actions';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [isPending, startTransition] = useTransition();
    const [errorMessage, setErrorMessage] = useState<string | undefined>('');
    const [registerMessage, setRegisterMessage] = useState<string | undefined>('');

    const handleLogin = async (formData: FormData) => {
        setErrorMessage('');
        try {
            startTransition(async () => {
                const result = await authenticate(undefined, formData);
                if (result) setErrorMessage(result);
            });
        } catch (e) {
            setErrorMessage('An unexpected client error occurred. Please try again.');
            console.error('Login transition error:', e);
        }
    };

    const handleRegister = async (formData: FormData) => {
        setRegisterMessage('');
        try {
            startTransition(async () => {
                const result = await register(undefined, formData);
                if (result) setRegisterMessage(result);
            });
        } catch (e) {
            setRegisterMessage('An unexpected client error occurred. Please try again.');
            console.error('Registration transition error:', e);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-2">
                        WorkLife Balance
                    </h1>
                    <p className="text-slate-500">
                        {isLogin ? 'Welcome back! Ready to focus?' : 'Join us to reclaim your time.'}
                    </p>
                </div>

                <div className="flex bg-slate-100 p-1 rounded-xl mb-6 relative">
                    <button
                        onClick={() => setIsLogin(true)}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg relative z-10 transition-colors ${isLogin ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        Log In
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg relative z-10 transition-colors ${!isLogin ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        Sign Up
                    </button>
                    <motion.div
                        layout
                        initial={false}
                        animate={{ x: isLogin ? 0 : '100%' }}
                        className="absolute top-1 left-1 w-[calc(50%-4px)] h-[calc(100%-8px)] bg-white rounded-lg shadow-sm"
                    />
                </div>

                <AnimatePresence mode="wait">
                    {isLogin ? (
                        <motion.form
                            key="login"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            action={handleLogin}
                            className="space-y-4"
                        >
                            <Input name="email" type="email" placeholder="Email Address" required />
                            <Input name="password" type="password" placeholder="Password" required />

                            {errorMessage && (
                                <div className="p-3 bg-red-50 text-red-500 text-sm rounded-xl text-center">
                                    {errorMessage}
                                </div>
                            )}

                            <SubmitButton label="Log In" pending={isPending} />
                        </motion.form>
                    ) : (
                        <motion.form
                            key="signup"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            action={handleRegister}
                            className="space-y-4"
                        >
                            {registerMessage === 'success' ? (
                                <div className="p-4 bg-green-50 text-green-600 rounded-xl text-center">
                                    <p className="font-bold">Account created! 🎉</p>
                                    <p className="text-sm mt-1">Signing you in, please wait...</p>
                                </div>
                            ) : (
                                <>
                                    <Input name="name" type="text" placeholder="Full Name" required />
                                    <Input name="email" type="email" placeholder="Email Address" required />
                                    <Input name="password" type="password" placeholder="Password (min 6 chars)" minLength={6} required />

                                    {registerMessage && (
                                        <div className="p-3 bg-red-50 text-red-500 text-sm rounded-xl text-center">
                                            {registerMessage}
                                        </div>
                                    )}

                                    <SubmitButton label="Create Account" pending={isPending} />
                                </>
                            )}
                        </motion.form>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}

function Input({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-400 font-medium"
        />
    );
}

function SubmitButton({ label, pending }: { label: string, pending: boolean }) {
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-lg hover:shadow-lg hover:shadow-primary/30 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
            {pending ? 'Please wait...' : label}
        </button>
    );
}
