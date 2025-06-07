import React, { useState } from 'react';
import { LogIn, Building2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { useApp } from '../../contexts/AppContext';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useApp();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (login(email, password)) {
      // Login successful - handled by context
    } else {
      setError('Email ou senha inválidos');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-emerald-100 rounded-full">
              <Building2 className="w-8 h-8 text-emerald-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Sistema de Pedidos</h1>
          <p className="text-gray-600 mt-2">Cooperativa & Mercados Parceiros</p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
            
            <Input
              label="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sua senha"
              required
            />
            
            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}
            
            <Button type="submit" className="w-full">
              <LogIn className="w-4 h-4 mr-2" />
              Entrar
            </Button>
          </form>
          
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-600 text-center mb-3">Contas de demonstração:</p>
            <div className="space-y-2 text-xs text-gray-500">
              <div className="flex justify-between">
                <span>Cooperativa:</span>
                <span>admin@cooperativa.com</span>
              </div>
              <div className="flex justify-between">
                <span>Mercado:</span>
                <span>joao@mercadosaojoao.com</span>
              </div>
              <div className="text-center mt-2">
                <span className="font-medium">Senha: 123456</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};