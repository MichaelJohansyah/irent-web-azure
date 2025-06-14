import { Head, useForm } from '@inertiajs/react';
import { Eye, EyeOff, LoaderCircle, User, Mail, Phone, MapPin, Upload, Lock, AlertCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

type RegisterForm = {
    name: string;
    email: string;
    phone: string;
    address: string;
    ktp_photo: File | null;
    password: string;
    password_confirmation: string;
    role: 'customer' | 'partner';
};

type InputFieldProps = {
    icon: React.ElementType;
    type?: string;
    placeholder?: string;
    value?: string;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    error?: string;
    showPassword?: boolean;
    togglePassword?: () => void;
    accept?: string;
    className?: string;
    [key: string]: any;
};

const InputField = ({ 
    icon: Icon, 
    type = "text", 
    placeholder, 
    value, 
    onChange, 
    error, 
    showPassword, 
    togglePassword,
    accept,
    className = "",
    ...props 
}: InputFieldProps) => (
    <div className="space-y-2">
        <div className="relative group">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors duration-200 z-10">
                <Icon size={18} />
            </div>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                accept={accept}
                className={`w-full pl-12 pr-4 py-3.5 bg-muted/30 border-0 rounded-lg focus:bg-background focus:ring-2 focus:ring-primary/20 focus:shadow-lg transition-all duration-300 placeholder:text-muted-foreground text-foreground ${
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
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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

type SelectFieldProps = {
    icon: React.ElementType;
    value: string;
    onChange: React.ChangeEventHandler<HTMLSelectElement>;
    error?: string;
    children: React.ReactNode;
    [key: string]: any;
};

const SelectField = ({ icon: Icon, value, onChange, error, children, ...props }: SelectFieldProps) => (
    <div className="space-y-2">
        <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none z-10">
                <Icon size={18} />
            </div>
            <select
                value={value}
                onChange={onChange}
                className="w-full pl-12 pr-4 py-3.5 bg-muted/30 border-0 rounded-lg focus:bg-background focus:ring-2 focus:ring-primary/20 focus:shadow-lg transition-all duration-300 text-foreground appearance-none cursor-pointer"
                {...props}
            >
                {children}
            </select>
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="text-muted-foreground" width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
        </div>
        {error && (
            <div className="flex items-center gap-2 text-destructive text-sm pl-4">
                <AlertCircle size={14} />
                {error}
            </div>
        )}
    </div>
);

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<RegisterForm>({
        name: '',
        email: '',
        phone: '',
        address: '',
        ktp_photo: null,
        password: '',
        password_confirmation: '',
        role: 'customer',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
            forceFormData: true,
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-secondary/20 flex items-center justify-center p-4">
            <Head title="Register" />
            
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-chart-1 to-chart-2 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <User className="text-white" size={28} />
                    </div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Create Account</h1>
                    <p className="text-muted-foreground">Join us and start your journey</p>
                </div>

                {/* Form Card */}
                <div className="bg-card/80 backdrop-blur-sm rounded-2xl shadow-xl border border-border/50 p-8">
                    <div className="space-y-5" onSubmit={submit}>
                        <InputField
                            icon={User}
                            placeholder="Full name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            error={errors.name}
                            required
                            autoFocus
                            autoComplete="name"
                            disabled={processing}
                        />

                        <InputField
                            icon={Mail}
                            type="email"
                            placeholder="Email address"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            error={errors.email}
                            required
                            autoComplete="email"
                            disabled={processing}
                        />

                        <InputField
                            icon={Phone}
                            placeholder="Phone number"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            error={errors.phone}
                            required
                            autoComplete="tel"
                            disabled={processing}
                        />

                        <InputField
                            icon={MapPin}
                            placeholder="Address"
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            error={errors.address}
                            required
                            autoComplete="street-address"
                            disabled={processing}
                        />

                        <InputField
                            icon={Upload}
                            type="file"
                            accept="image/*"
                            onChange={(e) => setData('ktp_photo', e.target.files ? e.target.files[0] : null)}
                            error={errors.ktp_photo}
                            required
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
                            autoComplete="new-password"
                            disabled={processing}
                        />

                        <InputField
                            icon={Lock}
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            error={errors.password_confirmation}
                            showPassword={showConfirmPassword}
                            togglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                            required
                            autoComplete="new-password"
                            disabled={processing}
                        />

                        <SelectField
                            icon={User}
                            value={data.role}
                            onChange={(e) => setData('role', e.target.value as 'customer' | 'partner')}
                            error={errors.role}
                            disabled={processing}
                            required
                        >
                            <option value="customer">Register as Customer</option>
                            <option value="partner">Register as Partner</option>
                        </SelectField>

                        <button
                            type="submit"
                            onClick={submit}
                            disabled={processing}
                            className="w-full py-4 bg-gradient-to-r from-chart-1 to-chart-2 hover:from-chart-1/90 hover:to-chart-2/90 text-white rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-3 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl mt-6"
                        >
                            {processing && <LoaderCircle size={20} className="animate-spin" />}
                            Create Account
                        </button>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-muted-foreground text-sm">
                            Already have an account?{' '}
                            <TextLink 
                                href={route('login')} 
                                className="text-chart-1 hover:text-chart-1/80 font-medium transition-colors"
                            >
                                Sign in
                            </TextLink>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}