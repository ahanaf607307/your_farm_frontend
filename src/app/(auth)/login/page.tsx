'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { toast } from 'sonner';
import { Sprout, Lock, Mail, Loader2, ArrowLeft } from 'lucide-react';
import { useAppDispatch } from '@/redux/hooks';
import { loginSuccess, setLoading } from '@/redux/slices/authSlice';
import { axiosInstance } from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

const loginSchema = zod.object({
  email: zod.string().email({ message: 'Please enter a valid email address.' }),
  password: zod.string().min(6, { message: 'Password must be at least 6 characters.' }),
  rememberMe: zod.boolean().optional(),
});

type LoginFormValues = zod.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [submitting, setSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setSubmitting(true);
    dispatch(setLoading(true));
    try {
      // Calls our Axios interceptor which intercepts and returns mock JWT
      const res = await axiosInstance.post('/auth/login', {
        email: data.email,
        password: data.password,
      });

      dispatch(loginSuccess(res.data));
      toast.success(`Welcome back, ${res.data.user.name}!`);
      
      // Redirect based on role
      const role = res.data.user.role;
      if (role === 'SYSTEM_OWNER') {
        router.push('/system-owner');
      } else if (role === 'BUSINESS_OWNER') {
        router.push('/business-owner');
      } else if (role === 'FARM_MANAGER') {
        router.push('/manager');
      } else {
        router.push('/employee');
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Login failed. Please check credentials.';
      toast.error(errMsg);
    } finally {
      setSubmitting(false);
      dispatch(setLoading(false));
    }
  };

  const handleQuickFill = (email: string, roleName: string) => {
    setValue('email', email);
    setValue('password', 'password');
    toast.info(`Filled credentials for ${roleName}`);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-background">
      {/* Left panel: Info & Testimonial (Hidden on mobile) */}
      <div className="hidden lg:flex lg:col-span-5 bg-zinc-950 text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[350px] h-[350px] bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center space-x-2 z-10">
          <Link href="/" className="flex items-center space-x-2 text-white hover:text-orange-400 transition-colors">
            <Sprout className="h-6 w-6 text-orange-400" />
            <span className="font-extrabold text-xl tracking-tight">Farmly</span>
          </Link>
        </div>

        <div className="space-y-6 z-10 max-w-md">
          <h2 className="text-3xl font-extrabold leading-tight">
            Streamline agricultural workflows in real-time.
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Log into the central control panel to supervise livestock lists, medicine schedules, inventories, chat threads, and employee task completions.
          </p>
        </div>

        <div className="border-t border-zinc-800 pt-6 z-10">
          <p className="italic text-zinc-400 text-xs">
            "We cut vaccine coordination errors down to zero and managed feed usage across multiple chicken categories effortlessly."
          </p>
          <div className="mt-3 text-2xs font-semibold text-orange-400">
            David Carter — Farm Manager, Vance Poultry Division
          </div>
        </div>
      </div>

      {/* Right panel: Login Form */}
      <div className="lg:col-span-7 flex flex-col justify-center items-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center text-xs text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Home
            </Link>
          </div>

          <Card className="border shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
              <CardDescription>
                Enter your credentials to access your account dashboard.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
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
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="/forgot-password"
                      className="text-xs text-orange-600 dark:text-orange-400 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
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

                <div className="flex items-center space-x-2 pt-1">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    {...register('rememberMe')}
                  />
                  <Label htmlFor="rememberMe" className="text-xs font-normal">
                    Remember my login status
                  </Label>
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
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Don't have a registered business?{' '}
                  <Link
                    href="/register"
                    className="text-orange-600 dark:text-orange-400 font-semibold hover:underline"
                  >
                    Register Business
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>

          {/* Quick-Fill Box for Testing */}
          <div className="border border-orange-500/20 bg-orange-500/5 dark:bg-orange-500/2 p-4 rounded-xl space-y-3">
            <span className="text-xs font-semibold text-orange-600 dark:text-orange-400 block">
              Auto-Fill Demo Roles (Click to choose dashboard):
            </span>
            <div className="grid grid-cols-2 gap-2 text-2xs">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickFill('admin@farmly.com', 'System Owner')}
                className="h-8 py-1 px-2 border-orange-500/20 hover:bg-orange-500/10 text-orange-700 dark:text-orange-400"
              >
                1. System Owner
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickFill('robert@vancefarms.com', 'Business Owner')}
                className="h-8 py-1 px-2 border-orange-500/20 hover:bg-orange-500/10 text-orange-700 dark:text-orange-400"
              >
                2. Business Owner
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickFill('david@vancefarms.com', 'Farm Manager')}
                className="h-8 py-1 px-2 border-orange-500/20 hover:bg-orange-500/10 text-orange-700 dark:text-orange-400"
              >
                3. Farm Manager
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickFill('alex@vancefarms.com', 'Farm Employee')}
                className="h-8 py-1 px-2 border-orange-500/20 hover:bg-orange-500/10 text-orange-700 dark:text-orange-400"
              >
                4. Farm Employee
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
