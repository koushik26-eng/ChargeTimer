import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Header from '@/components/Header';

const LoginPage = () => {
  const navigate = useNavigate();
  const { requestMagicLink, verifyMagicLink } = useAuth();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await requestMagicLink(email);
      setStep(2);
      toast.success('Code sent to your email', {
        description: 'Check your inbox for the 8-digit verification code.',
      });
    } catch (err) {
      setError(err.message);
      toast.error('Failed to send code', {
        description: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await verifyMagicLink(code);
      toast.success('Login successful');
      navigate('/calculator');
    } catch (err) {
      setError(err.message);
      toast.error('Verification failed', {
        description: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError('');
    setIsLoading(true);

    try {
      await requestMagicLink(email);
      toast.success('New code sent', {
        description: 'Check your inbox for a new verification code.',
      });
    } catch (err) {
      setError(err.message);
      toast.error('Failed to resend code', {
        description: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login - ChargeTimer</title>
        <meta name="description" content="Login to ChargeTimer with magic link authentication. No password required." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-cyan-400 mb-4 shadow-lg shadow-primary/20">
                <Zap className="w-8 h-8 text-background" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
              <p className="text-muted-foreground">
                {step === 1 ? 'Enter your email to receive a login code' : 'Enter the code sent to your email'}
              </p>
            </div>

            <div className="glass-card rounded-2xl p-8">
              {step === 1 ? (
                <form onSubmit={handleSendCode} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        className="pl-10 input-glass text-foreground"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                      <p className="text-sm text-destructive">{error}</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90"
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      'Sending code...'
                    ) : (
                      <>
                        Send Login Code
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleVerify} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="code">Verification code</Label>
                    <Input
                      id="code"
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 8))}
                      placeholder="00000000"
                      maxLength={8}
                      required
                      className="input-glass text-center text-2xl tracking-widest font-mono text-foreground"
                      disabled={isLoading}
                      autoFocus
                    />
                    <p className="text-xs text-muted-foreground text-center">
                      Enter the 8-digit code sent to {email}
                    </p>
                  </div>

                  {error && (
                    <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                      <p className="text-sm text-destructive">{error}</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90"
                    size="lg"
                    disabled={isLoading || code.length !== 8}
                  >
                    {isLoading ? 'Verifying...' : 'Verify and Login'}
                  </Button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={handleResendCode}
                      disabled={isLoading}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors underline"
                    >
                      Resend code
                    </button>
                    <span className="mx-2 text-muted-foreground">•</span>
                    <button
                      type="button"
                      onClick={() => {
                        setStep(1);
                        setCode('');
                        setError('');
                      }}
                      disabled={isLoading}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors underline"
                    >
                      Change email
                    </button>
                  </div>
                </form>
              )}
            </div>

            <p className="text-center text-sm text-muted-foreground mt-6">
              No password required. We will send you a secure login code via email.
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;