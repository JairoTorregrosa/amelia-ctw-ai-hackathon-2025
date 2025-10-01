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
      setError('Por favor ingresa un número de teléfono válido');
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(phoneNumber);

      if (result.success) {
        router.push('/dashboard');
      } else {
        setError(result.error || 'Inicio de sesión fallido');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Ocurrió un error al acceder a tus resultados de la demo. Inténtalo de nuevo.');
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
          <p className="text-slate-600">Cargando...</p>
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
            Volver al inicio
          </Link>
          <div className="mb-4 flex justify-center">
            <img src="/logo.png" alt="Amelia Logo" width={60} height={60} />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-slate-800">Acceso a la demo</h1>
          <p className="text-slate-600">
            Ingresa tu número de teléfono para ver tus insights de terapia de la sesión demo
          </p>
        </div>

        {/* Login Form */}
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Accede a los resultados de la demo</CardTitle>
            <CardDescription>
              Ingresa tu número de teléfono con código de país (por ejemplo, +57 para Colombia)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium text-slate-700">
                  Número de teléfono con código de país
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
                  Incluye tu código de país (p. ej., +57 para Colombia, +1 para EE. UU.)
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
                    Accediendo a la demo...
                  </>
                ) : (
                  'Ver resultados'
                )}
              </Button>
            </form>

          </CardContent>
        </Card>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            ¿Tienes problemas para acceder a tus resultados?{' '}
            <Link
              href="https://wa.me/573112853261?text=Estoy teniendo problemas para acceder a mis resultados de la demo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-psychology-blue hover:underline"
            >
              Contactar soporte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
