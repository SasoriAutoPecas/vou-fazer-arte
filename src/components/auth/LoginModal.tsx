import React, { useState } from 'react';
import { Mail, Lock, User, Building, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Swal from 'sweetalert2';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState<'donor' | 'institution'>('donor');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    cpf: '',
    cnpj: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const success = await login(formData.email, formData.password, userType);
        if (success) {
          await Swal.fire({
            icon: 'success',
            title: 'Login realizado com sucesso!',
            text: 'Bem-vindo(a) ao Benigna',
            confirmButtonColor: '#2E7D32'
          });
          onClose();
        } else {
          await Swal.fire({
            icon: 'error',
            title: 'Erro no login',
            text: 'Email ou senha incorretos',
            confirmButtonColor: '#2E7D32'
          });
        }
      } else {
        // Simulate registration
        await new Promise(resolve => setTimeout(resolve, 1000));
        await Swal.fire({
          icon: 'success',
          title: 'Cadastro realizado com sucesso!',
          text: 'Sua conta foi criada. Faça login para continuar.',
          confirmButtonColor: '#2E7D32'
        });
        setIsLogin(true);
      }
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Ocorreu um erro. Tente novamente.',
        confirmButtonColor: '#2E7D32'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isLogin ? 'Entrar' : 'Criar Conta'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* User Type Toggle */}
        {!isLogin && (
          <div className="flex p-1 bg-gray-100 rounded-lg">
            <button
              type="button"
              onClick={() => setUserType('donor')}
              className={`
                flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors
                ${userType === 'donor'
                  ? 'bg-white text-green-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
                }
              `}
            >
              <User className="w-4 h-4 inline mr-2" />
              Doador
            </button>
            <button
              type="button"
              onClick={() => setUserType('institution')}
              className={`
                flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors
                ${userType === 'institution'
                  ? 'bg-white text-green-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
                }
              `}
            >
              <Building className="w-4 h-4 inline mr-2" />
              Instituição
            </button>
          </div>
        )}

        {/* Registration Fields */}
        {!isLogin && (
          <>
            <Input
              label={userType === 'donor' ? 'Nome Completo' : 'Nome da Instituição'}
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            
            <Input
              label="Telefone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="(11) 99999-9999"
              required
            />

            {userType === 'donor' ? (
              <Input
                label="CPF"
                name="cpf"
                value={formData.cpf}
                onChange={handleInputChange}
                placeholder="000.000.000-00"
                required
              />
            ) : (
              <Input
                label="CNPJ"
                name="cnpj"
                value={formData.cnpj}
                onChange={handleInputChange}
                placeholder="00.000.000/0000-00"
                required
              />
            )}
          </>
        )}

        {/* Email */}
        <Input
          label="E-mail"
          name="email"
          type="email"
          icon={Mail}
          value={formData.email}
          onChange={handleInputChange}
          placeholder="seu@email.com"
          required
        />

        {/* Password */}
        <div className="relative">
          <Input
            label="Senha"
            name="password"
            type={showPassword ? 'text' : 'password'}
            icon={Lock}
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Sua senha"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {/* Login Info */}
        {isLogin && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Para testar:</strong><br />
              Email: donor@test.com<br />
              Senha: 123456
            </p>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          loading={loading}
          fullWidth
          size="lg"
        >
          {isLogin ? 'Entrar' : 'Criar Conta'}
        </Button>

        {/* Toggle Login/Register */}
        <p className="text-center text-sm text-gray-600">
          {isLogin ? 'Não tem conta?' : 'Já tem conta?'}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="ml-1 text-green-600 hover:text-green-700 font-medium"
          >
            {isLogin ? 'Cadastre-se' : 'Faça login'}
          </button>
        </p>
      </form>
    </Modal>
  );
};

export default LoginModal;