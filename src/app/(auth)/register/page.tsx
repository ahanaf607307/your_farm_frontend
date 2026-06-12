'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { toast } from 'sonner';
import { Sprout, Lock, Mail, User, Briefcase, Loader2, ArrowLeft } from 'lucide-react';
import { useAppDispatch } from '@/redux/hooks';
import { loginSuccess, setLoading } from '@/redux/slices/authSlice';
import { axiosInstance } from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

const registerSchema = zod.object({
  name: zod.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  businessName: zod.string().min(3, { message: 'Business name must be at least 3 characters.' }),
  email: zod.string().email({ message: 'Please enter a valid email address.' }),
  password: zod.string().min(6, { message: 'Password must be at least 6 characters.' }),
  agreeTerms: zod.boolean().refine(val => val === true, {
    message: 'You must agree to the Terms of Service.',
  }),
});

type RegisterFormValues = zod.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [submitting, setSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      businessName: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setSubmitting(true);
    dispatch(setLoading(true));
    try {
      const res = await axiosInstance.post('/auth/register', {
        name: data.name,
        businessName: data.businessName,
        email: data.email,
        password: data.password,
      });

      dispatch(loginSuccess(res.data));
      toast.success(`Welcome to Farmly, ${data.name}! Your business has been registered.`);
      router.push('/business-owner');
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Registration failed. Try a different email.';
      toast.error(errMsg);
    } finally {
      setSubmitting(false);
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-background">
      {/* Left panel */}
      <div className="hidden lg:flex lg:col-span-5 bg-zinc-950 text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[350px] h-[350px] bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center space-x-2 z-10">
          <Link href="/" className="flex items-center space-x-2 text-white hover:text-orange-400 transition-colors">
            <Sprout className="h-6 w-6 text-orange-400" />
            <span className="font-extrabold text-xl tracking-tight">Farmly</span>
          </Link>
        </div>

        <div className="space-y-6 z-10 max-w-md">
          <h2 className="text-3xl font-extrabold leading-tight">
            Digitize your farms, monitor livestock, maximize profit.
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Create an owner account to spawn multiple poultry, dairy, fish, or cattle farms, assign managers, schedule tasks, and track logs in real-time.
          </p>
        </div>

        <div className="border-t border-zinc-800 pt-6 z-10">
          <p className="italic text-zinc-400 text-xs">
            "Setting up Vance Poultry stable details was a breeze. Highly recommended for expanding agricultural groups."
          </p>
          <div className="mt-3 text-2xs font-semibold text-orange-400">
            Robert Vance — Managing Director, Vance Agricultural Group
          </div>
        </div>
      </div>

      {/* Right panel: Registration Form */}
      <div className="lg:col-span-7 flex flex-col justify-center items-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center text-xs text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Home
            </Link>
          </div>

          <Card className="border shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Register Business</CardTitle>
              <CardDescription>
                Sign up as a Business Owner to manage multiple farms.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      placeholder="John Doe"
                      className="pl-9"
                      {...register('name')}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-xs text-destructive mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessName">Business / Farm Group Name</Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="businessName"
                      placeholder="e.g. Vance Agricultural Group"
                      className="pl-9"
                      {...register('businessName')}
                    />
                  </div>
                  {errors.businessName && (
                    <p className="text-xs text-destructive mt-1">{errors.businessName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@company.com"
                      className="pl-9"
                      {...register('email')}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-9"
                      {...register('password')}
                    />
                  </div>
                  {errors.password && (
                    <p className="text-xs text-destructive mt-1">{errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-2 pt-1">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="agreeTerms"
                      className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      {...register('agreeTerms')}
                    />
                    <Label htmlFor="agreeTerms" className="text-xs font-normal">
                      I agree to the{' '}
                      <a href="#" className="text-orange-600 hover:underline">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="#" className="text-orange-600 hover:underline">
                        Privacy Policy
                      </a>
                    </Label>
                  </div>
                  {errors.agreeTerms && (
                    <p className="text-xs text-destructive mt-1">{errors.agreeTerms.message}</p>
                  )}
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-4">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-6 rounded-lg font-semibold text-sm shadow-md"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registering...
                    </>
                  ) : (
                    'Register Business'
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Already have an account?{' '}
                  <Link
                    href="/login"
                    className="text-orange-600 dark:text-orange-400 font-semibold hover:underline"
                  >
                    Sign In
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
