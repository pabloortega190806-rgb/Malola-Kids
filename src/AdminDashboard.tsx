import React, { useState, useEffect } from 'react';
import { useAdmin } from './context/AdminContext';
import { useNavigate } from 'react-router-dom';
import { Lock, LogOut, ExternalLink, BarChart3, Eye, MousePointerClick } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function AdminDashboard() {
  const { isAdmin, login, logout, token } = useAdmin();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  useEffect(() => {
    if (isAdmin && token) {
      setLoadingAnalytics(true);
      fetch('/api/admin/analytics', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setAnalyticsData(data.data);
          }
        })
        .catch(err => console.error("Error fetching analytics:", err))
        .finally(() => setLoadingAnalytics(false));
    }
  }, [isAdmin, token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = await login(password);
    if (!success) {
      setError('Contraseña incorrecta');
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#FCFBF9] px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm border border-[#F5F0EB]">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-[#F5F0EB] rounded-full flex items-center justify-center text-[#B89F82]">
              <Lock size={24} />
            </div>
          </div>
          <h2 className="text-2xl font-serif font-bold text-center text-[#3E2A24] mb-8">
            Acceso Propietaria
          </h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#5D4037] mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-[#E5D9C5] rounded-md focus:ring-[#B89F82] focus:border-[#B89F82] outline-none"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button
              type="submit"
              className="w-full bg-[#B89F82] text-white py-3 rounded-md font-medium hover:bg-[#967A70] transition-colors"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif font-bold text-[#3E2A24]">Panel de Administración</h1>
        <button
          onClick={logout}
          className="flex items-center text-[#967A70] hover:text-[#5D4037] transition-colors"
        >
          <LogOut size={20} className="mr-2" />
          Cerrar Sesión
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-[#F5F0EB] md:col-span-1">
          <h2 className="text-xl font-serif font-bold text-[#3E2A24] mb-4">Gestión de Productos</h2>
          <p className="text-[#5D4037] mb-6">
            Para editar un producto, navega por la tienda como lo haría un cliente. 
            Ahora que has iniciado sesión, verás un botón de "Editar" en cada producto.
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-[#B89F82] text-white px-6 py-3 rounded-md font-medium hover:bg-[#967A70] transition-colors"
          >
            Ir a la tienda
          </button>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-[#F5F0EB] md:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-serif font-bold text-[#3E2A24] flex items-center">
              <BarChart3 className="mr-2 text-[#B89F82]" size={24} />
              Analíticas de Visitas
            </h2>
            {analyticsData && (
              <div className="bg-[#F5F0EB] px-4 py-2 rounded-lg text-center">
                <p className="text-xs text-[#967A70] uppercase font-bold tracking-wider">Total Visitas</p>
                <p className="text-2xl font-bold text-[#3E2A24]">{analyticsData.totalViews}</p>
              </div>
            )}
          </div>
          
          {loadingAnalytics ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B89F82]"></div>
            </div>
          ) : analyticsData && analyticsData.viewsByDay.length > 0 ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData.viewsByDay} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5D9C5" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(tick) => {
                      const d = new Date(tick);
                      return `${d.getDate()}/${d.getMonth() + 1}`;
                    }}
                    stroke="#967A70"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis stroke="#967A70" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    labelFormatter={(label) => new Date(label).toLocaleDateString('es-ES')}
                  />
                  <Line type="monotone" dataKey="views" stroke="#B89F82" strokeWidth={3} dot={{ r: 4, fill: '#B89F82', strokeWidth: 0 }} activeDot={{ r: 6 }} name="Visitas" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-[#967A70]">
              No hay datos suficientes para mostrar la gráfica.
            </div>
          )}
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-[#F5F0EB]">
        <h2 className="text-xl font-serif font-bold text-[#3E2A24] mb-6 flex items-center">
          <Eye className="mr-2 text-[#B89F82]" size={24} />
          Páginas Más Vistas
        </h2>
        
        {loadingAnalytics ? (
          <div className="h-32 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B89F82]"></div>
          </div>
        ) : analyticsData && analyticsData.topPages.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#E5D9C5]">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#967A70] uppercase tracking-wider">Ruta</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-[#967A70] uppercase tracking-wider">Visitas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5D9C5]">
                {analyticsData.topPages.map((page: any, idx: number) => (
                  <tr key={idx} className="hover:bg-[#FCFBF9] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#5D4037] font-medium">
                      {page.path === '/' ? 'Inicio' : page.path}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#5D4037] text-right">
                      {page.views}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-[#967A70]">
            Aún no hay páginas registradas.
          </div>
        )}
      </div>
    </div>
  );
}
