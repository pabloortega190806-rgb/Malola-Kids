import React, { useState, useEffect } from 'react';
import { useAdmin } from './context/AdminContext';
import { useNavigate } from 'react-router-dom';
import { Lock, LogOut, ExternalLink, BarChart3, Eye, MousePointerClick, ShoppingBag, Settings, CheckCircle2, XCircle, Calendar, Filter, MapPin, ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ProductModal } from './components/ProductModal';

export default function AdminDashboard() {
  const { isAdmin, login, logout, token } = useAdmin();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [debugEnv, setDebugEnv] = useState<any>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingDebug, setLoadingDebug] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      setLoadingCategories(true);
      fetch('/api/categories')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setCategories(data);
        })
        .catch(err => console.error("Error fetching categories:", err))
        .finally(() => setLoadingCategories(false));
    }
  }, [isAdmin]);

  // Date range for analytics (default: last 7 days)
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  useEffect(() => {
    if (isAdmin && token) {
      setLoadingAnalytics(true);
      fetch(`/api/admin/analytics?startDate=${startDate}&endDate=${endDate}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) setAnalyticsData(data.data);
        })
        .catch(err => console.error("Error fetching analytics:", err))
        .finally(() => setLoadingAnalytics(false));
    }
  }, [isAdmin, token, startDate, endDate]);

  useEffect(() => {
    if (isAdmin && token) {
      setLoadingOrders(true);
      fetch('/api/admin/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) setOrders(data.data);
        })
        .catch(err => console.error("Error fetching orders:", err))
        .finally(() => setLoadingOrders(false));

      setLoadingDebug(true);
      fetch('/api/debug-env')
        .then(res => res.json())
        .then(data => setDebugEnv(data))
        .catch(err => console.error("Error fetching debug env:", err))
        .finally(() => setLoadingDebug(false));
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

  const formatPathName = (path: string) => {
    const categoryMap: Record<string, string> = {
      'Primera Postura': 'Primera Postura',
      'Bebé Niña (0-4 años)': 'Bebé Niña',
      'Bebé Niño (0-4 años)': 'Bebé Niño',
      'Niña (3-9 años)': 'Niña Infantil',
      'Niño (3-9 años)': 'Niño Infantil',
      'Baño Niña': 'Baño Niña',
      'Baño Niño': 'Baño Niño',
      'Complementos': 'Complementos'
    };

    if (path.startsWith('/categoria/')) {
      const slug = path.replace('/categoria/', '');
      return categoryMap[slug] || (slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' '));
    }
    if (path.startsWith('/marca/')) {
      const slug = path.replace('/marca/', '');
      return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }
    return path;
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

      {/* All-Time Views Card */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-[#F5F0EB] mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#3E2A24] flex items-center">
            <Eye className="mr-3 text-[#B89F82]" size={28} />
            Visitas Totales
          </h2>
        </div>
        <div className="text-6xl font-serif font-bold text-[#B89F82] bg-[#FCFBF9] px-8 py-4 rounded-xl border border-[#E5D9C5]">
          {loadingAnalytics ? '-' : (analyticsData?.allTimeTotalViews || 0)}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 mb-12">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-[#F5F0EB]">
          <div 
            className="flex items-center justify-between cursor-pointer group"
            onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
          >
            <div className="flex items-center">
              <Filter className="mr-3 text-[#B89F82]" size={28} />
              <h2 className="text-2xl font-serif font-bold text-[#3E2A24]">
                Gestión de Categorías
              </h2>
              <span className="ml-4 text-sm font-medium text-[#967A70] bg-[#F5F0EB] px-3 py-1 rounded-full">
                {categories.length} categorías
              </span>
            </div>
            <div className="text-[#967A70] group-hover:text-[#5D4037] transition-colors bg-[#FCFBF9] p-2 rounded-full border border-[#E5D9C5]">
              {isCategoriesOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </div>
          </div>
          
          {isCategoriesOpen && (
            <div className="mt-8 border-t border-[#F5F0EB] pt-8">
              {loadingCategories ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B89F82]"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((cat) => (
                    <div key={cat} className="flex items-center justify-between p-4 bg-[#FCFBF9] rounded-lg border border-[#E5D9C5] group">
                      <span className="font-medium text-[#5D4037]">{cat}</span>
                      <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => {
                            const newName = prompt(`Nuevo nombre para la categoría "${cat}":`, cat);
                            if (newName && newName !== cat) {
                              fetch('/api/admin/categories', {
                                method: 'PUT',
                                headers: { 
                                  'Content-Type': 'application/json',
                                  'Authorization': `Bearer ${token}` 
                                },
                                body: JSON.stringify({ oldName: cat, newName })
                              })
                              .then(res => res.json())
                              .then(data => {
                                if (data.success) {
                                  alert(data.message);
                                  window.location.reload();
                                } else {
                                  alert(data.error || 'Error al renombrar');
                                }
                              });
                            }
                          }}
                          className="p-1.5 text-[#B89F82] hover:bg-white rounded-md transition-colors"
                          title="Renombrar"
                        >
                          <Settings size={16} />
                        </button>
                        <button 
                          onClick={() => {
                            if (window.confirm(`¿Estás segura de que quieres eliminar la categoría "${cat}"? SE ELIMINARÁN TODOS LOS PRODUCTOS ASOCIADOS.`)) {
                              fetch(`/api/admin/categories/${encodeURIComponent(cat)}`, {
                                method: 'DELETE',
                                headers: { 'Authorization': `Bearer ${token}` }
                              })
                              .then(res => res.json())
                              .then(data => {
                                if (data.success) {
                                  alert(data.message);
                                  window.location.reload();
                                } else {
                                  alert(data.error || 'Error al eliminar');
                                }
                              });
                            }
                          }}
                          className="p-1.5 text-red-400 hover:bg-white rounded-md transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-[#F5F0EB]">
          <div 
            className="flex items-center justify-between cursor-pointer group"
            onClick={() => setIsOrdersOpen(!isOrdersOpen)}
          >
            <div className="flex items-center">
              <ShoppingBag className="mr-3 text-[#B89F82]" size={28} />
              <h2 className="text-2xl font-serif font-bold text-[#3E2A24]">
                Pedidos Recientes
              </h2>
              <span className="ml-4 text-sm font-medium text-[#967A70] bg-[#F5F0EB] px-3 py-1 rounded-full">
                {orders.length} pedidos
              </span>
            </div>
            <div className="text-[#967A70] group-hover:text-[#5D4037] transition-colors bg-[#FCFBF9] p-2 rounded-full border border-[#E5D9C5]">
              {isOrdersOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </div>
          </div>
          
          {isOrdersOpen && (
            <div className="mt-8 border-t border-[#F5F0EB] pt-8">
              {loadingOrders ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B89F82]"></div>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12 bg-[#FCFBF9] rounded-lg border border-dashed border-[#E5D9C5]">
                  <ShoppingBag className="mx-auto h-12 w-12 text-[#D4C5B0] mb-3" />
                  <p className="text-[#967A70] font-medium">No hay pedidos registrados todavía.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#FCFBF9] border-y border-[#E5D9C5]">
                        <th className="py-4 px-4 font-serif font-semibold text-[#5D4037] text-sm uppercase tracking-wider">Pedido</th>
                        <th className="py-4 px-4 font-serif font-semibold text-[#5D4037] text-sm uppercase tracking-wider">Fecha</th>
                        <th className="py-4 px-4 font-serif font-semibold text-[#5D4037] text-sm uppercase tracking-wider">Cliente / Envío</th>
                        <th className="py-4 px-4 font-serif font-semibold text-[#5D4037] text-sm uppercase tracking-wider">Artículos</th>
                        <th className="py-4 px-4 font-serif font-semibold text-[#5D4037] text-sm uppercase tracking-wider">Total</th>
                        <th className="py-4 px-4 font-serif font-semibold text-[#5D4037] text-sm uppercase tracking-wider">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F5F0EB]">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-[#FCFBF9] transition-colors group">
                          <td className="py-5 px-4">
                            <span className="font-mono text-sm font-medium text-[#3E2A24]">#{order.id}</span>
                          </td>
                          <td className="py-5 px-4 text-sm text-[#5D4037]">
                            {new Date(order.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                            <span className="block text-xs text-[#967A70]">
                              {new Date(order.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </td>
                          <td className="py-5 px-4">
                            <div className="font-medium text-[#3E2A24] text-sm mb-1">{order.customer_email}</div>
                            {order.shipping_method === 'store' ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#F5F0EB] text-[#967A70]">
                                <MapPin size={12} className="mr-1" /> Recogida en tienda
                              </span>
                            ) : (
                              <div className="text-xs text-[#967A70] leading-tight">
                                <span className="font-medium text-[#5D4037]">{order.shipping_address?.firstName || order.shipping_address?.name} {order.shipping_address?.lastName || ''}</span><br/>
                                {order.shipping_address?.city}, {order.shipping_address?.postalCode || order.shipping_address?.postal_code}
                              </div>
                            )}
                          </td>
                          <td className="py-5 px-4">
                            <div className="text-xs text-[#5D4037] space-y-1">
                              {order.items?.map((item: any, idx: number) => (
                                <div key={idx} className="flex items-center">
                                  <span className="font-medium mr-1">{item.quantity}x</span> 
                                  <span className="truncate max-w-[150px]" title={item.name}>{item.name}</span>
                                  <span className="text-[#967A70] ml-1">({item.size})</span>
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="py-5 px-4 text-sm font-bold text-[#3E2A24]">
                            {Number(order.total_amount).toFixed(2)}€
                          </td>
                          <td className="py-5 px-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                              order.status === 'paid' ? 'bg-green-50 text-green-700 border-green-200' : 
                              order.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 
                              'bg-gray-50 text-gray-700 border-gray-200'
                            }`}>
                              {order.status === 'paid' ? 'Pagado' : 
                               order.status === 'pending' ? 'Pendiente' : 
                               order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-[#F5F0EB] lg:col-span-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <h2 className="text-2xl font-serif font-bold text-[#3E2A24] flex items-center">
              <BarChart3 className="mr-3 text-[#B89F82]" size={28} />
              Analíticas de Visitas
            </h2>
            
            <div className="flex flex-wrap items-center gap-4 bg-[#FCFBF9] p-3 rounded-lg border border-[#E5D9C5]">
              <div className="flex items-center text-sm">
                <Calendar size={16} className="text-[#967A70] mr-2" />
                <span className="text-[#5D4037] font-medium mr-2">Desde:</span>
                <input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-white border border-[#E5D9C5] rounded px-2 py-1 text-[#3E2A24] focus:outline-none focus:border-[#B89F82]"
                />
              </div>
              <div className="flex items-center text-sm">
                <span className="text-[#5D4037] font-medium mr-2">Hasta:</span>
                <input 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-white border border-[#E5D9C5] rounded px-2 py-1 text-[#3E2A24] focus:outline-none focus:border-[#B89F82]"
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              {loadingAnalytics ? (
                <div className="h-72 flex items-center justify-center bg-[#FCFBF9] rounded-xl border border-dashed border-[#E5D9C5]">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B89F82]"></div>
                </div>
              ) : analyticsData && analyticsData.viewsByDay.length > 0 ? (
                <div className="h-72 w-full">
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
                        dy={10}
                      />
                      <YAxis stroke="#967A70" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: '1px solid #E5D9C5', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        labelFormatter={(label) => new Date(label).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        labelStyle={{ color: '#5D4037', fontWeight: 'bold', marginBottom: '4px', textTransform: 'capitalize' }}
                        itemStyle={{ color: '#B89F82', fontWeight: 'medium' }}
                      />
                      <Line type="monotone" dataKey="views" stroke="#B89F82" strokeWidth={3} dot={{ r: 4, fill: '#B89F82', strokeWidth: 0 }} activeDot={{ r: 6, fill: '#3E2A24', stroke: '#fff', strokeWidth: 2 }} name="Visitas" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-72 flex flex-col items-center justify-center bg-[#FCFBF9] rounded-xl border border-dashed border-[#E5D9C5] text-[#967A70]">
                  <BarChart3 size={32} className="mb-2 text-[#D4C5B0]" />
                  <p>No hay datos de visitas para este rango de fechas.</p>
                </div>
              )}
            </div>
            
            <div className="lg:col-span-1 flex flex-col justify-center">
              <div className="bg-[#FCFBF9] p-6 rounded-xl border border-[#E5D9C5] text-center h-full flex flex-col justify-center">
                <p className="text-sm text-[#967A70] uppercase font-bold tracking-wider mb-2">Total Visitas del Periodo</p>
                <p className="text-5xl font-serif font-bold text-[#3E2A24]">
                  {loadingAnalytics ? '-' : (analyticsData?.totalViews || 0)}
                </p>
                <p className="text-xs text-[#967A70] mt-4">
                  Desde {new Date(startDate).toLocaleDateString('es-ES')} <br/>
                  hasta {new Date(endDate).toLocaleDateString('es-ES')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-[#F5F0EB]">
          <h2 className="text-xl font-serif font-bold text-[#3E2A24] mb-6 flex items-center">
            <Filter className="mr-2 text-[#B89F82]" size={24} />
            Categorías y Marcas Más Valoradas
          </h2>
          <p className="text-sm text-[#967A70] mb-6">
            Descubre qué secciones de tu tienda atraen más interés según el rango de fechas seleccionado.
          </p>
          
          {loadingAnalytics ? (
            <div className="h-48 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B89F82]"></div>
            </div>
          ) : analyticsData && analyticsData.topPages.length > 0 ? (
            <div className="space-y-4">
              {analyticsData.topPages.map((page: any, idx: number) => {
                const maxViews = analyticsData.topPages[0].views;
                const percentage = Math.max(5, Math.round((page.views / maxViews) * 100));
                
                return (
                  <div key={idx} className="relative">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-[#5D4037]">{formatPathName(page.path)}</span>
                      <span className="font-bold text-[#B89F82]">{page.views} visitas</span>
                    </div>
                    <div className="w-full bg-[#F5F0EB] rounded-full h-2">
                      <div 
                        className="bg-[#B89F82] h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-[#FCFBF9] rounded-lg border border-dashed border-[#E5D9C5] text-[#967A70]">
              <p>No hay datos de categorías/marcas para este periodo.</p>
            </div>
          )}
        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-[#F5F0EB]">
            <h2 className="text-xl font-serif font-bold text-[#3E2A24] mb-4 flex items-center">
              <Settings className="mr-2 text-[#B89F82]" size={20} />
              Estado del Sistema
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-[#FCFBF9] rounded-lg border border-[#E5D9C5]">
                <span className="text-sm font-medium text-[#5D4037]">Base de Datos</span>
                {debugEnv?.hasDbUrl ? (
                  <span className="flex items-center text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full"><CheckCircle2 size={14} className="mr-1" /> CONECTADO</span>
                ) : (
                  <span className="flex items-center text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full"><XCircle size={14} className="mr-1" /> ERROR</span>
                )}
              </div>
              <div className="flex items-center justify-between p-3 bg-[#FCFBF9] rounded-lg border border-[#E5D9C5]">
                <span className="text-sm font-medium text-[#5D4037]">Pagos (Stripe)</span>
                {debugEnv?.hasStripeKey ? (
                  <span className="flex items-center text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full"><CheckCircle2 size={14} className="mr-1" /> ACTIVO</span>
                ) : (
                  <span className="flex items-center text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full"><XCircle size={14} className="mr-1" /> INACTIVO</span>
                )}
              </div>
              <div className="flex items-center justify-between p-3 bg-[#FCFBF9] rounded-lg border border-[#E5D9C5]">
                <span className="text-sm font-medium text-[#5D4037]">Imágenes (Cloudinary)</span>
                {debugEnv?.hasCloudinary ? (
                  <span className="flex items-center text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full"><CheckCircle2 size={14} className="mr-1" /> CONECTADO</span>
                ) : (
                  <span className="flex items-center text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full"><XCircle size={14} className="mr-1" /> ERROR</span>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-[#F5F0EB]">
            <h2 className="text-xl font-serif font-bold text-[#3E2A24] mb-4">Gestión de Productos</h2>
            <p className="text-sm text-[#5D4037] mb-6">
              Puedes añadir nuevos productos directamente desde aquí o editar los existentes navegando por la tienda.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => setIsAddProductModalOpen(true)}
                className="w-full bg-[#5D4037] text-white px-6 py-3 rounded-md font-medium hover:bg-[#3E2A24] transition-colors flex items-center justify-center"
              >
                <Plus size={18} className="mr-2" />
                Añadir Nuevo Producto
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full bg-[#B89F82] text-white px-6 py-3 rounded-md font-medium hover:bg-[#967A70] transition-colors flex items-center justify-center"
              >
                <ExternalLink size={18} className="mr-2" />
                Ir a la tienda para editar
              </button>
            </div>
          </div>
        </div>
      </div>

      <ProductModal
        isOpen={isAddProductModalOpen}
        onClose={() => setIsAddProductModalOpen(false)}
        onSave={(newProduct) => {
          alert(`Producto ${newProduct.name} creado correctamente.`);
          setIsAddProductModalOpen(false);
        }}
        mode="create"
      />
    </div>
  );
}
