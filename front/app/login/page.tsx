'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Phone, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, authLoading, router]);

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');

    // If it starts with +, preserve it
    if (value.startsWith('+')) {
      return `+${digits}`;
    }

    // For Colombian numbers (10 digits), add +57 prefix
    if (digits.length === 10 && !digits.startsWith('57')) {
      return `+57 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
    }

    // For US numbers (10 digits), add +1 prefix
    if (digits.length === 10 && !digits.startsWith('1')) {
      return `+1 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    }

    // For other international numbers, just add + prefix
    return `+${digits}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
    setError('');
  };

  const validatePhoneNumber = (phone: string) => {
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 10;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validatePhoneNumber(phoneNumber)) {
      setError('Please enter a valid phone number');
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(phoneNumber);

      if (result.success) {
        router.push('/dashboard');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred while accessing your demo results. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-100 to-white p-4">
        <div className="text-center">
          <Loader2 className="text-psychology-blue mx-auto mb-4 h-8 w-8 animate-spin" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-100 to-white p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-slate-600 hover:text-slate-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <div className="mb-4 flex justify-center">
            <img src="/logo.png" alt="Amelia Logo" width={60} height={60} />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-slate-800">Demo Access</h1>
          <p className="text-slate-600">
            Enter your phone number to view your therapy insights from the demo session
          </p>
        </div>

        {/* Login Form */}
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Access Demo Results</CardTitle>
            <CardDescription>
              Enter your phone number with country code (e.g., +57 for Colombia)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium text-slate-700">
                  Phone Number with Country Code
                </label>
                <div className="relative">
                  <Phone className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-slate-400" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+57 300 123 4567"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    className="pl-10"
                    disabled={isLoading}
                    required
                  />
                </div>
                <p className="text-xs text-slate-500">
                  Include your country code (e.g., +57 for Colombia, +1 for US)
                </p>
              </div>

              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="bg-psychology-blue hover:bg-psychology-blue/90 w-full cursor-pointer"
                disabled={isLoading || !phoneNumber}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Accessing Demo...
                  </>
                ) : (
                  'View Demo Results'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">
                This is a demo session. Your phone number should have been registered during the
                demo process.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            Having trouble accessing your demo results?{' '}
            <Link
              href="https://wa.me/573112853261?text=I'm having trouble accessing my demo results"
              target="_blank"
              rel="noopener noreferrer"
              className="text-psychology-blue hover:underline"
            >
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
