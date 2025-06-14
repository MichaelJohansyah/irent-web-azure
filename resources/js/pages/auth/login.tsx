import { Head, useForm } from '@inertiajs/react';
import { Eye, EyeOff, LoaderCircle, Mail, Lock, AlertCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

const InputField = ({ 
    icon: Icon, 
    type = "text", 
    placeholder, 
    value, 
    onChange, 
    error, 
    showPassword, 
    togglePassword,
    className = "",
    ...props 
}: {
    icon: React.ComponentType<{ size?: number }>;
    type?: string;
    placeholder?: string;
    value?: string;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    error?: string;
    showPassword?: boolean;
    togglePassword?: () => void;
    className?: string;
    [key: string]: any;
}) => (
    <div className="space-y-2">
        <div className="relative group">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors duration-200 z-10">
                <Icon size={20} />
            </div>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`w-full pl-12 pr-4 py-4 bg-muted/30 border-0 rounded-lg focus:bg-background focus:ring-2 focus:ring-primary/20 focus:shadow-lg transition-all duration-300 placeholder:text-muted-foreground text-foreground ${
                    error ? 'ring-2 ring-destructive/50 bg-destructive/5' : ''
                } ${type === 'password' ? 'pr-12' : ''} ${className}`}
                {...props}
            />
            {type === 'password' && (
                <button
                    type="button"
                    onClick={togglePassword}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors z-10"
                >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            )}
        </div>
        {error && (
            <div className="flex items-center gap-2 text-destructive text-sm pl-4">
                <AlertCircle size={14} />
                {error}
            </div>
        )}
    </div>
);

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/20 flex items-center justify-center p-4">
            <Head title="Log in" />
            
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                        {/* Replace Lock component with iRent text */}
                        <span className="text-primary-foreground font-bold text-xl">iRent</span>
                    </div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
                    <p className="text-muted-foreground">Sign in to continue to your account</p>
                </div>

                {/* Status Message */}
                {status && (
                    <div className="mb-6 p-4 bg-chart-4/10 border border-chart-4/20 rounded-lg text-center">
                        <p className="text-chart-4 text-sm font-medium">{status}</p>
                    </div>
                )}

                {/* Form Card */}
                <div className="bg-card/80 backdrop-blur-sm rounded-2xl shadow-xl border border-border/50 p-8">
                    <div className="space-y-6" onSubmit={submit}>
                        <InputField
                            icon={Mail}
                            type="email"
                            placeholder="Email address"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            error={errors.email}
                            required
                            autoFocus
                            autoComplete="email"
                            disabled={processing}
                        />

                        <InputField
                            icon={Lock}
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            error={errors.password}
                            showPassword={showPassword}
                            togglePassword={() => setShowPassword(!showPassword)}
                            required
                            autoComplete="current-password"
                            disabled={processing}
                        />

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="sr-only"
                                        disabled={processing}
                                    />
                                    <div className={`w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center ${
                                        data.remember 
                                            ? 'bg-primary border-primary' 
                                            : 'border-border group-hover:border-primary/50'
                                    }`}>
                                        {data.remember && (
                                            <svg className="text-primary-foreground" width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                                                <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        )}
                                    </div>
                                </div>
                                <span className="text-sm text-muted-foreground">Remember me</span>
                            </label>
                            
                            {canResetPassword && (
                                <TextLink 
                                    href={route('password.request')} 
                                    className="text-sm text-primary hover:text-primary/80 transition-colors"
                                >
                                    Forgot password?
                                </TextLink>
                            )}
                        </div>

                        <button
                            type="submit"
                            onClick={submit}
                            disabled={processing}
                            className="w-full py-4 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-3 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
                        >
                            {processing && <LoaderCircle size={20} className="animate-spin" />}
                            Sign In
                        </button>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-muted-foreground text-sm">
                            Don't have an account?{' '}
                            <TextLink 
                                href={route('register')} 
                                className="text-primary hover:text-primary/80 font-medium transition-colors"
                            >
                                Sign up
                            </TextLink>
                        </p>
                    </div>
                </div>

                {/* Verification Modal */}
                {errors.email === 'Your account is pending verification by admin.' && (
                    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in-0">
                        <div className="bg-card rounded-2xl shadow-2xl border border-border p-8 max-w-sm w-full text-center animate-in zoom-in-95">
                            <div className="w-16 h-16 bg-chart-2/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <AlertCircle className="text-chart-2" size={28} />
                            </div>
                            <h2 className="text-xl font-bold text-foreground mb-2">Account Pending</h2>
                            <p className="text-muted-foreground mb-6 leading-relaxed">
                                Your registration was successful, but your account must be verified by an admin before you can log in.<br />
                                Please check back later. If you need urgent access, contact support or the admin team.
                            </p>
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}