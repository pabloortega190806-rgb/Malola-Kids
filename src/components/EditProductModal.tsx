import React, { useState } from 'react';
import { Product } from '../hooks/useProducts';
import { useAdmin } from '../context/AdminContext';
import { X } from 'lucide-react';

interface EditProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedProduct: Product) => void;
}

export function EditProductModal({ product, isOpen, onClose, onSave }: EditProductModalProps) {
  const { token } = useAdmin();
  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description || '',
    brand: product.brand || '',
    category: product.category || '',
    color: product.color || '',
    original_price: product.original_price,
    discounted_price: product.discounted_price,
  });
  const [sizesStock, setSizesStock] = useState<Record<string, number>>({ ...product.sizes_stock });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(product.image_url || null);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleStockChange = (size: string, value: string) => {
    setSizesStock(prev => ({
      ...prev,
      [size]: parseInt(value) || 0
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let finalImageUrl = product.image_url;

      if (imageFile) {
        setUploadingImage(true);
        const formDataUpload = new FormData();
        formDataUpload.append('image', imageFile);
        formDataUpload.append('code', product.code);

        const uploadRes = await fetch('/api/admin/upload-image', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formDataUpload
        });

        const uploadData = await uploadRes.json();
        if (uploadData.success) {
          finalImageUrl = uploadData.url;
        } else {
          throw new Error(uploadData.error || 'Error al subir la imagen');
        }
        setUploadingImage(false);
      }

      const res = await fetch(`/api/products/${product.code}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          original_price: Number(formData.original_price),
          discounted_price: Number(formData.discounted_price),
          sizes_stock: sizesStock,
          image_url: finalImageUrl
        })
      });

      const data = await res.json();
      if (data.success) {
        onSave({ ...data.product, image_url: finalImageUrl });
        onClose();
      } else {
        setError(data.error || 'Error al actualizar el producto');
      }
    } catch (err: any) {
      setError(err.message || 'Error de conexión');
      setUploadingImage(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex justify-between items-center z-10">
          <h2 className="text-xl font-serif font-bold text-[#3E2A24]">Editar Producto: {product.code}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{error}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Imagen del Producto</label>
              <div className="flex items-center space-x-4">
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" className="w-20 h-20 object-cover rounded-md border border-gray-200" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#F5F0EB] file:text-[#5D4037] hover:file:bg-[#E5D9C5]"
                />
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#B89F82] focus:border-[#B89F82]"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#B89F82] focus:border-[#B89F82]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#B89F82] focus:border-[#B89F82]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#B89F82] focus:border-[#B89F82]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#B89F82] focus:border-[#B89F82]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 col-span-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio Original (€)</label>
                <input
                  type="number"
                  step="0.01"
                  name="original_price"
                  value={formData.original_price}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#B89F82] focus:border-[#B89F82]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio Rebajado (€)</label>
                <input
                  type="number"
                  step="0.01"
                  name="discounted_price"
                  value={formData.discounted_price}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#B89F82] focus:border-[#B89F82]"
                  required
                />
              </div>
            </div>

            <div className="col-span-2">
              <h3 className="text-sm font-medium text-gray-700 mb-3 border-b pb-2">Stock por Tallas</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {Object.entries(sizesStock).map(([size, stock]) => (
                  <div key={size} className="flex items-center space-x-2">
                    <label className="text-sm text-gray-600 w-16 truncate" title={size}>{size}</label>
                    <input
                      type="number"
                      min="0"
                      value={stock}
                      onChange={(e) => handleStockChange(size, e.target.value)}
                      className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:ring-[#B89F82] focus:border-[#B89F82] text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-[#B89F82] text-white rounded-md font-medium hover:bg-[#967A70] transition-colors disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
