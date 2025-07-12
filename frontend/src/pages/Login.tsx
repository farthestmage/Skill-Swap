import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { ShimmerButton } from '../components/ui/shimmer-button';
import { useAuthStore } from '../../stores/authStore';
import {userLogin} from "../../api/Login"

const LoginSchema = z.object({
    email: z.email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof LoginSchema>;

const LoginForm: React.FC = () => {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(LoginSchema),
    });

    const { setAccessToken } = useAuthStore();

    const onSubmit = async (data: LoginFormData) => {
        try {
            const { accessToken } = await userLogin(data);
            setAccessToken(accessToken);
            reset();
            navigate('/home');
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="flex justify-center items-center bg-orange px-3 h-screen font-inter">
            <div className="z-50 space-y-8 bg-white shadow-md p-8 rounded sm:w-96">
                <h2 className="font-grotesk font-bold text-black text-2xl text-center">
                    Welcome Back
                </h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label
                            htmlFor="email"
                            className="block font-medium text-gray-700 text-sm"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            type="text"
                            autoComplete="email"
                            placeholder="Email address"
                            {...register('email')}
                            className="bg-gray-100 mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-500 w-full text-black sm:text-sm"
                        />
                        {errors.email && (
                            <p className="mt-1 text-red-500 text-sm">
                                {errors.email.message}
                            </p>
                        )}
                    </div>
                    <div>
                        <label
                            htmlFor="password"
                            className="block font-medium text-gray-700 text-sm"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            autoComplete="current-password"
                            placeholder="Password"
                            {...register('password')}
                            className="bg-gray-100 mt-1 mb-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-500 w-full text-black sm:text-sm"
                        />
                        {errors.password && (
                            <p className="mt-1 text-red-500 text-sm">
                                {errors.password.message}
                            </p>
                        )}
                    </div>
                    <div className="content-center grid">
                        <button type="submit" disabled={isSubmitting}>
                            <ShimmerButton>
                                {isSubmitting ? 'Logging in...' : 'Submit'}
                            </ShimmerButton>
                        </button>
                    </div>
                </form>
                <div className="flex justify-center">
                    <span className="text-slate-600 text-sm">
                        Don’t have an account?
                        <Link
                            to="/signup"
                            className="ml-1 font-bold text-black text-sm hover:underline underline-offset-2"
                        >
                            Sign Up
                        </Link>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;