import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Ticket, Plus, Trash2, Edit2, X, Check } from 'lucide-react';

interface DiscountCode {
  id: number;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: string; // from numeric column
  active: boolean;
  usage_limit: number | null;
  used_count: number;
  created_at: string;
}

export function DiscountCodes() {
  const { token } = useAdmin();
  const [codes, setCodes] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    code: '',
    discount_type: 'percentage',
    discount_value: '',
    active: true,
    usage_limit: ''
  });

  const fetchCodes = () => {
    setLoading(true);
    fetch('/api/admin/discount-codes', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setCodes(data.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCodes();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : null
      };

      const url = editingId 
        ? `/api/admin/discount-codes/${editingId}` 
        : `/api/admin/discount-codes`;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (data.success) {
        setIsAdding(false);
        setEditingId(null);
        setFormData({ code: '', discount_type: 'percentage', discount_value: '', active: true, usage_limit: '' });
        fetchCodes();
      } else {
        alert(data.error || 'Error guardando el código');
      }
    } catch (err) {
      alert('Error en el servidor');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Seguro que quieres eliminar este código?")) return;
    try {
      const res = await fetch(`/api/admin/discount-codes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchCodes();
    } catch (err) {
      alert('Error al eliminar');
    }
  };

  const startEdit = (code: DiscountCode) => {
    setFormData({
      code: code.code,
      discount_type: code.discount_type,
      discount_value: code.discount_value,
      active: code.active,
      usage_limit: code.usage_limit ? String(code.usage_limit) : ''
    });
    setEditingId(code.id);
    setIsAdding(true);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-[#F5F0EB]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-serif font-bold text-[#3E2A24] flex items-center">
          <Ticket className="mr-2 text-[#B89F82]" size={24} />
          Códigos de Descuento
        </h3>
        <button
          onClick={() => {
            setIsAdding(!isAdding);
            if (!isAdding) {
              setEditingId(null);
              setFormData({ code: '', discount_type: 'percentage', discount_value: '', active: true, usage_limit: '' });
            }
          }}
          className="flex items-center text-sm bg-[#FCFBF9] border border-[#E5D9C5] px-3 py-1.5 rounded-md hover:bg-[#F5F0EB] transition-colors"
        >
          {isAdding ? <X size={16} className="mr-1" /> : <Plus size={16} className="mr-1" />}
          {isAdding ? 'Cancelar' : 'Nuevo Código'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-8 bg-[#FCFBF9] p-4 rounded-lg border border-[#E5D9C5] space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#5D4037] mb-1">Código</label>
              <input
                type="text"
                value={formData.code}
                onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                required
                className="w-full px-3 py-1.5 border border-[#E5D9C5] rounded-md text-sm outline-none uppercase font-mono"
                placeholder="EJ: VERANO20"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#5D4037] mb-1">Tipo</label>
              <select
                value={formData.discount_type}
                onChange={e => setFormData({ ...formData, discount_type: e.target.value as any })}
                className="w-full px-3 py-1.5 border border-[#E5D9C5] rounded-md text-sm outline-none"
              >
                <option value="percentage">Porcentaje (%)</option>
                <option value="fixed">Fijo (€)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#5D4037] mb-1">Valor</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.discount_value}
                onChange={e => setFormData({ ...formData, discount_value: e.target.value })}
                required
                className="w-full px-3 py-1.5 border border-[#E5D9C5] rounded-md text-sm outline-none"
                placeholder={formData.discount_type === 'percentage' ? 'Ej: 10' : 'Ej: 5.00'}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#5D4037] mb-1">Límite usos (Opcional)</label>
              <input
                type="number"
                min="1"
                value={formData.usage_limit}
                onChange={e => setFormData({ ...formData, usage_limit: e.target.value })}
                className="w-full px-3 py-1.5 border border-[#E5D9C5] rounded-md text-sm outline-none"
                placeholder="Ilimitado"
              />
            </div>
            <div className="flex items-end justify-between lg:justify-start lg:space-x-4">
              <label className="flex items-center space-x-2 text-sm text-[#5D4037] cursor-pointer mb-2 lg:mb-1.5">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={e => setFormData({ ...formData, active: e.target.checked })}
                  className="rounded text-[#B89F82] focus:ring-[#B89F82]"
                />
                <span>Activo</span>
              </label>
              <button
                type="submit"
                className="bg-[#B89F82] text-white px-4 py-1.5 rounded-md hover:bg-[#967A70] transition-colors flex items-center text-sm"
              >
                <Check size={16} className="mr-1" /> Guardar
              </button>
            </div>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-8 text-[#967A70]">Cargando códigos...</div>
      ) : codes.length === 0 ? (
        <div className="text-center py-8 text-[#967A70] bg-[#FCFBF9] rounded-lg border border-dashed border-[#E5D9C5]">
          No hay códigos de descuento creados.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E5D9C5] text-sm text-[#967A70]">
                <th className="pb-2 font-medium">Código</th>
                <th className="pb-2 font-medium">Descuento</th>
                <th className="pb-2 font-medium">Estado</th>
                <th className="pb-2 font-medium">Usos</th>
                <th className="pb-2 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {codes.map(code => (
                <tr key={code.id} className="border-b border-[#F5F0EB] text-sm group hover:bg-[#FCFBF9]">
                  <td className="py-3 font-mono font-medium text-[#3E2A24]">{code.code}</td>
                  <td className="py-3 text-[#5D4037]">
                    {code.discount_type === 'percentage' 
                      ? `${Number(code.discount_value)}%` 
                      : `${Number(code.discount_value).toFixed(2)}€`}
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${code.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {code.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="py-3 text-[#5D4037]">
                    {code.used_count} {code.usage_limit ? `/ ${code.usage_limit}` : 'uses'}
                  </td>
                  <td className="py-3 text-right">
                    <button 
                      onClick={() => startEdit(code)}
                      className="p-1.5 text-[#B89F82] hover:text-[#5D4037] hover:bg-white rounded-md transition-colors inline-block mr-1"
                      title="Editar"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(code.id)}
                      className="p-1.5 text-red-400 hover:text-red-600 hover:bg-white rounded-md transition-colors inline-block"
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
