'use client';
export const dynamic = 'force-dynamic';

import { useSearchParams, useRouter, Suspense } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Check, Loader2, Mail } from 'lucide-react';
import { authApi } from '../_lib/api';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const emailParam = searchParams.get('email');
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'pending'>('loading');
  const [message, setMessage] = useState('');
  const [resent, setResent] = useState(false);

  useEffect(() => {
    if (token) {
      authApi.verifyEmail(token)
        .then(() => {
          setStatus('success');
          setMessage('Email verified! Redirecting to login...');
          setTimeout(() => router.push('/login'), 2000);
        })
        .catch((err) => {
          setStatus('error');
          setMessage(err instanceof Error ? err.message : 'Verification failed');
        });
    } else {
      setStatus('pending');
    }
  }, [token, router]);

  const handleResend = async () => {
    if (!emailParam) return;
    try {
      await authApi.resendVerification(emailParam);
      setResent(true);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed to resend');
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
              <p className="mt-4 text-gray-600">Verifying your email...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <p className="mt-4 text-green-600 font-medium">{message}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              Verification Failed
            </CardTitle>
            <CardDescription>{message}</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/login">
              <Button className="w-full">Back to Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Check Your Email
          </CardTitle>
          <CardDescription>
            We sent a verification link to <span className="font-medium text-gray-900">{emailParam}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-50 text-blue-700 text-sm rounded-lg">
            Click the link in the email to verify your account.
          </div>
          <Button variant="outline" className="w-full" onClick={handleResend} disabled={resent}>
            {resent ? 'Email Sent!' : 'Resend Verification Email'}
          </Button>
          <div className="text-center text-sm">
            <span className="text-gray-500">Already verified? </span>
            <Link href="/login" className="text-blue-600 hover:underline">Sign in</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}