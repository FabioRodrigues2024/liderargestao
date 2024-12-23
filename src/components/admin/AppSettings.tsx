import React, { useState, useEffect } from 'react';
import { Upload, Save, Lock, Mail } from 'lucide-react';

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
}

interface AdminCredentials {
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function AppSettings() {
  const [logo, setLogo] = useState<string | null>(localStorage.getItem('systemLogo'));
  const [colors, setColors] = useState<ThemeColors>({
    primary: '#2563eb',
    secondary: '#4f46e5',
    accent: '#0ea5e9',
  });
  const [appName, setAppName] = useState(localStorage.getItem('systemName') || 'Financial Control');
  const [adminCredentials, setAdminCredentials] = useState<AdminCredentials>({
    email: 'fabio@fcontador.com.br',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<AdminCredentials>>({});

  // Load initial admin email from localStorage
  useEffect(() => {
    const savedEmail = localStorage.getItem('adminEmail');
    if (savedEmail) {
      setAdminCredentials(prev => ({ ...prev, email: savedEmail }));
    }
  }, []);

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 2MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Logo = reader.result as string;
        setLogo(base64Logo);
        localStorage.setItem('systemLogo', base64Logo);
        
        // Dispatch event to notify other components
        window.dispatchEvent(new Event('systemLogoChanged'));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleColorChange = (key: keyof ThemeColors, value: string) => {
    setColors(prev => ({ ...prev, [key]: value }));
  };

  const handleAppNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setAppName(newName);
    localStorage.setItem('systemName', newName);
    
    // Dispatch event to notify other components
    window.dispatchEvent(new Event('systemNameChanged'));
  };

  const validatePasswordChange = () => {
    const newErrors: Partial<AdminCredentials> = {};

    if (!adminCredentials.currentPassword) {
      newErrors.currentPassword = 'Senha atual é obrigatória';
    }

    if (adminCredentials.newPassword) {
      if (adminCredentials.newPassword.length < 8) {
        newErrors.newPassword = 'A nova senha deve ter no mínimo 8 caracteres';
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(adminCredentials.newPassword)) {
        newErrors.newPassword = 'A senha deve conter letras maiúsculas, minúsculas, números e caracteres especiais';
      }

      if (adminCredentials.newPassword !== adminCredentials.confirmPassword) {
        newErrors.confirmPassword = 'As senhas não coincidem';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (adminCredentials.newPassword && !validatePasswordChange()) {
      return;
    }

    // Save admin email
    localStorage.setItem('adminEmail', adminCredentials.email);

    // In a real app, you would make an API call to update the password
    if (adminCredentials.newPassword && adminCredentials.currentPassword === 'F4b10@058') {
      // Simulate password update
      localStorage.setItem('adminPassword', adminCredentials.newPassword);
    }

    // Reset password fields
    setAdminCredentials(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));

    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg';
    notification.textContent = 'Configurações salvas com sucesso!';
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">
          Configurações do Sistema
        </h2>
        <button
          onClick={handleSave}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Save className="h-5 w-5 mr-2" />
          Salvar Alterações
        </button>
      </div>

      <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
        {/* Logo Settings */}
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Logo do Sistema</h3>
          <div className="flex items-center space-x-6">
            <div className="flex-shrink-0">
              {logo ? (
                <img
                  src={logo}
                  alt="Logo do Sistema"
                  className="h-24 w-24 object-contain"
                />
              ) : (
                <div className="h-24 w-24 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Upload className="h-8 w-8 text-gray-400" />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Logo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="mt-1 text-sm text-gray-500">
                PNG, JPG até 2MB. Dimensão recomendada: 200x200px
              </p>
            </div>
          </div>
        </div>

        {/* App Name Settings */}
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Nome do Sistema</h3>
          <div className="max-w-lg">
            <input
              type="text"
              value={appName}
              onChange={handleAppNameChange}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Admin Credentials */}
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Credenciais do Administrador</h3>
          <div className="max-w-lg space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email do Administrador
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={adminCredentials.email}
                  onChange={(e) => setAdminCredentials(prev => ({ ...prev, email: e.target.value }))}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Senha Atual
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={adminCredentials.currentPassword}
                  onChange={(e) => setAdminCredentials(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.currentPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nova Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={adminCredentials.newPassword}
                  onChange={(e) => setAdminCredentials(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.newPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar Nova Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={adminCredentials.confirmPassword}
                  onChange={(e) => setAdminCredentials(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="show-password"
                type="checkbox"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="show-password" className="ml-2 block text-sm text-gray-900">
                Mostrar senhas
              </label>
            </div>
          </div>
        </div>

        {/* Color Settings */}
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Cores do Tema</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cor Primária
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={colors.primary}
                  onChange={(e) => handleColorChange('primary', e.target.value)}
                  className="h-8 w-8 rounded-md border border-gray-300"
                />
                <input
                  type="text"
                  value={colors.primary}
                  onChange={(e) => handleColorChange('primary', e.target.value)}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cor Secundária
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={colors.secondary}
                  onChange={(e) => handleColorChange('secondary', e.target.value)}
                  className="h-8 w-8 rounded-md border border-gray-300"
                />
                <input
                  type="text"
                  value={colors.secondary}
                  onChange={(e) => handleColorChange('secondary', e.target.value)}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cor de Destaque
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={colors.accent}
                  onChange={(e) => handleColorChange('accent', e.target.value)}
                  className="h-8 w-8 rounded-md border border-gray-300"
                />
                <input
                  type="text"
                  value={colors.accent}
                  onChange={(e) => handleColorChange('accent', e.target.value)}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Prévia</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div
              style={{ backgroundColor: colors.primary }}
              className="h-20 rounded-lg shadow flex items-center justify-center text-white"
            >
              Primária
            </div>
            <div
              style={{ backgroundColor: colors.secondary }}
              className="h-20 rounded-lg shadow flex items-center justify-center text-white"
            >
              Secundária
            </div>
            <div
              style={{ backgroundColor: colors.accent }}
              className="h-20 rounded-lg shadow flex items-center justify-center text-white"
            >
              Destaque
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}