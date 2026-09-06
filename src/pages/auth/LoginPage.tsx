import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../contexts/auth/authStore';
import { Input } from '../../common/components/Input';
import { Button } from '../../common/components/Button';
import { useToast } from '../../common/components/Toast';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Por favor ingrese su correo electrónico');
      return;
    }
    if (!password || password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setIsLoading(true);
    try {
      await login({ email: email.trim(), password });
      toast.success('¡Bienvenido al sistema!');
      navigate('/invoices');
    } catch (err: any) {
      toast.error(err.message || 'Error al iniciar sesión. Verifique sus credenciales.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-surface-base relative overflow-hidden">
      {/* Decorative ambient glows */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-brand-primary/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-brand-accent/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="glass-card w-full max-w-md p-8 relative z-10 border border-border-medium/60 shadow-2xl">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-primary-light to-brand-primary text-white shadow-xl shadow-brand-primary/30 mb-4 border border-brand-accent/30">
            <Store size={32} />
          </div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">
            Panadería & Pastelería
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Registro y control de transacciones
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Correo Electrónico"
            type="email"
            placeholder="usuario@panaderia.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail size={18} />}
            autoFocus
            required
          />

          <Input
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock size={18} />}
            required
            helperText="Mínimo 6 caracteres"
          />

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
              rightIcon={<ArrowRight size={18} />}
            >
              Ingresar al Punto de Venta
            </Button>
          </div>
        </form>

        <div className="mt-8 text-center text-xs text-text-disabled">
          Sistema POS v1.0 • Panel de Facturación
        </div>
      </div>
    </div>
  );
};
