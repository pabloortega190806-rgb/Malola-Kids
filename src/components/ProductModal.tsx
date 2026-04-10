import React, { useState } from 'react';
import { Product } from '../hooks/useProducts';
import { useAdmin } from '../context/AdminContext';
import { X, ArrowUp, ArrowDown, Trash2, Upload, Link as LinkIcon } from 'lucide-react';

interface ProductModalProps {
  product?: Product; // Optional for creation
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  mode?: 'edit' | 'create';
}

export function ProductModal({ product, isOpen, onClose, onSave, mode = 'edit' }: ProductModalProps) {
  const { token } = useAdmin();
  const [formData, setFormData] = useState({
    code: product?.code || '',
    name: product?.name || '',
    description: product?.description || '',
    brand: product?.brand || '',
    category: product?.category || '',
    color: product?.color || '',
    original_price: product?.original_price || '0',
    discounted_price: product?.discounted_price || '0',
  });
  
  const defaultSizes = {
    '0-1M': 0, '1-3M': 0, '3-6M': 0, '6-9M': 0, '9-12M': 0, '12-18M': 0, '18-24M': 0,
    '2A': 0, '3A': 0, '4A': 0, '5A': 0, '6A': 0, '7A': 0, '8A': 0, '9A': 0
  };

  const [sizesStock, setSizesStock] = useState<Record<string, number>>(
    product?.sizes_stock ? { ...product.sizes_stock } : defaultSizes
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Image management state
  const initialImages = product?.local_images && product.local_images.length > 0 
    ? [...product.local_images] 
    : (product?.image_url ? [product.image_url] : []);
  const [images, setImages] = useState<string[]>(initialImages);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStockChange = (size: string, value: string) => {
    setSizesStock(prev => ({
      ...prev,
      [size]: parseInt(value) || 0
    }));
  };

  const addSize = () => {
    const size = prompt('Introduce el nombre de la talla (ej: 10A, S, M):');
    if (size && !sizesStock[size]) {
      setSizesStock(prev => ({ ...prev, [size]: 0 }));
    }
  };

  const removeSize = (size: string) => {
    const newSizes = { ...sizesStock };
    delete newSizes[size];
    setSizesStock(newSizes);
  };

  // Image management functions
  const moveImageUp = (index: number) => {
    if (index === 0) return;
    const newImages = [...images];
    [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
    setImages(newImages);
  };

  const moveImageDown = (index: number) => {
    if (index === images.length - 1) return;
    const newImages = [...images];
    [newImages[index + 1], newImages[index]] = [newImages[index], newImages[index + 1]];
    setImages(newImages);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleAddUrl = () => {
    if (newImageUrl.trim()) {
      setImages([...images, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    
    const file = e.target.files[0];
    setUploadingImage(true);
    setError('');
    
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('image', file);
      if (formData.code) {
        formDataUpload.append('code', formData.code);
      }

      const uploadRes = await fetch('/api/admin/upload-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataUpload
      });

      const uploadData = await uploadRes.json();
      if (uploadData.success) {
        setImages([...images, uploadData.url]);
      } else {
        throw new Error(uploadData.error || 'Error al subir la imagen');
      }
    } catch (err: any) {
      setError(err.message || 'Error al subir la imagen');
    } finally {
      setUploadingImage(false);
      // Reset input
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const finalImageUrl = images.length > 0 ? images[0] : '';
      const url = mode === 'edit' ? `/api/products/${product?.code}` : '/api/products';
      const method = mode === 'edit' ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          original_price: Number(formData.original_price),
          discounted_price: Number(formData.discounted_price),
          sizes_stock: sizesStock,
          image_url: finalImageUrl,
          local_images: images
        })
      });

      const data = await res.json();
      if (data.success) {
        onSave({ ...data.product, image_url: finalImageUrl, local_images: images });
        onClose();
      } else {
        setError(data.error || `Error al ${mode === 'edit' ? 'actualizar' : 'crear'} el producto`);
      }
    } catch (err: any) {
      setError(err.message || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex justify-between items-center z-10">
          <h2 className="text-xl font-serif font-bold text-[#3E2A24]">
            {mode === 'edit' ? `Editar Producto: ${product?.code}` : 'Añadir Nuevo Producto'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{error}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mode === 'create' && (
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Código del Producto (SKU)</label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="Ej: 21327-B"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#B89F82] focus:border-[#B89F82]"
                  required
                />
              </div>
            )}

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Imágenes del Producto</label>
              
              {/* Image List */}
              <div className="space-y-3 mb-4">
                {images.map((img, index) => (
                  <div key={index} className="flex items-center bg-gray-50 p-2 rounded-md border border-gray-200">
                    <img src={img} alt={`Img ${index}`} className="w-12 h-12 object-cover rounded mr-3" />
                    <div className="flex-1 truncate text-xs text-gray-500 mr-2" title={img}>
                      {img}
                    </div>
                    <div className="flex items-center space-x-1">
                      <button type="button" onClick={() => moveImageUp(index)} disabled={index === 0} className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30">
                        <ArrowUp size={16} />
                      </button>
                      <button type="button" onClick={() => moveImageDown(index)} disabled={index === images.length - 1} className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30">
                        <ArrowDown size={16} />
                      </button>
                      <button type="button" onClick={() => removeImage(index)} className="p-1 text-red-400 hover:text-red-600 ml-2">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                {images.length === 0 && <p className="text-sm text-gray-500 italic">No hay imágenes. Añade una abajo.</p>}
              </div>

              {/* Add Image Controls */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 flex space-x-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LinkIcon size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="URL de la imagen (ej. postimage)"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:ring-[#B89F82] focus:border-[#B89F82] text-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddUrl}
                    disabled={!newImageUrl.trim()}
                    className="px-3 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-200 text-sm font-medium disabled:opacity-50"
                  >
                    Añadir URL
                  </button>
                </div>
                
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  />
                  <button
                    type="button"
                    disabled={uploadingImage}
                    className="w-full sm:w-auto px-4 py-2 bg-[#F5F0EB] text-[#5D4037] border border-[#E5D9C5] rounded-md hover:bg-[#E5D9C5] text-sm font-medium flex items-center justify-center disabled:opacity-50"
                  >
                    {uploadingImage ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#5D4037] mr-2"></div>
                    ) : (
                      <Upload size={16} className="mr-2" />
                    )}
                    Subir Archivo
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">La primera imagen de la lista será la imagen principal del producto.</p>
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
              <div className="flex items-center justify-between mb-3 border-b pb-2">
                <h3 className="text-sm font-medium text-gray-700">Stock por Tallas</h3>
                <button 
                  type="button" 
                  onClick={addSize}
                  className="text-xs bg-[#F5F0EB] text-[#5D4037] px-2 py-1 rounded border border-[#E5D9C5] hover:bg-[#E5D9C5]"
                >
                  + Añadir Talla
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {Object.entries(sizesStock).map(([size, stock]) => (
                  <div key={size} className="flex items-center space-x-2 group">
                    <label className="text-sm text-gray-600 w-16 truncate" title={size}>{size}</label>
                    <input
                      type="number"
                      min="0"
                      value={stock}
                      onChange={(e) => handleStockChange(size, e.target.value)}
                      className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:ring-[#B89F82] focus:border-[#B89F82] text-sm"
                    />
                    <button 
                      type="button" 
                      onClick={() => removeSize(size)}
                      className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={14} />
                    </button>
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
              {loading ? 'Guardando...' : (mode === 'edit' ? 'Guardar Cambios' : 'Crear Producto')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
