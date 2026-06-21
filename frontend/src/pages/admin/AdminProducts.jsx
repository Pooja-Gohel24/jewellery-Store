import { useEffect, useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { getAdminProducts, createProduct, updateProduct, deleteProduct } from '../../api/admin'
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi'

const empty = { name: '', category: '', price: '', original_price: '', img: '', badge: '', description: '', rating: 0, reviews: 0, stock: 100 }

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(empty)
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState('')

  const load = () => getAdminProducts().then(setProducts).catch(console.error)

  useEffect(() => { load() }, [])

  const openAdd = () => { setEditing(null); setForm(empty); setFormError(''); setShowModal(true) }
  const openEdit = (p) => { setEditing(p); setForm({ ...p }); setFormError(''); setShowModal(true) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setFormError('')
    try {
      const data = { ...form, price: +form.price, original_price: +form.original_price, rating: +form.rating, reviews: +form.reviews }
      editing ? await updateProduct(editing.id, data) : await createProduct(data)
      setShowModal(false)
      load()
    } catch (err) {
      setFormError(err.response?.data?.detail || 'Failed to save product. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return
    await deleteProduct(id)
    load()
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-[#333]">Products</h1>
          <button onClick={openAdd} className="flex items-center gap-2 bg-[#8b5e3c] text-white px-4 py-2 rounded-xl text-sm hover:bg-[#7a5235] transition-colors">
            <FiPlus /> Add Product
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#f6f2ee] text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-5 py-3 text-left">Product</th>
                <th className="px-5 py-3 text-left">Category</th>
                <th className="px-5 py-3 text-left">Price</th>
                <th className="px-5 py-3 text-left">Stock</th>
                <th className="px-5 py-3 text-left">Rating</th>
                <th className="px-5 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 flex items-center gap-3">
                    <img src={p.img} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                    <span className="font-medium text-[#333] line-clamp-1">{p.name}</span>
                  </td>
                  <td className="px-5 py-3 text-gray-500">{p.category}</td>
                  <td className="px-5 py-3 font-medium text-[#8b5e3c]">₹{p.price.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-3 text-gray-500">
                    <span className={p.stock <= 10 ? 'text-red-500 font-medium' : ''}>{p.stock}</span>
                  </td>
                  <td className="px-5 py-3 text-gray-500">⭐ {p.rating}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(p)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"><FiEdit2 /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg"><FiTrash2 /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#333]">{editing ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={() => setShowModal(false)}><FiX className="text-gray-400 text-xl" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 rounded-lg">
                  ⚠️ {formError}
                </div>
              )}
              {[
                { name: 'name', label: 'Name' },
                { name: 'category', label: 'Category' },
                { name: 'price', label: 'Price', type: 'number' },
                { name: 'original_price', label: 'Original Price', type: 'number' },
                { name: 'stock', label: 'Stock', type: 'number' },
                { name: 'img', label: 'Image URL' },
                { name: 'badge', label: 'Badge (optional)' },
              ].map(f => (
                <div key={f.name}>
                  <label className="text-xs font-medium text-gray-500">{f.label}</label>
                  <input
                    type={f.type || 'text'}
                    value={form[f.name]}
                    onChange={e => setForm({ ...form, [f.name]: e.target.value })}
                    required={f.name !== 'badge'}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm mt-1 outline-none focus:border-[#8b5e3c]"
                  />
                </div>
              ))}
              <div>
                <label className="text-xs font-medium text-gray-500">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  required
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm mt-1 outline-none focus:border-[#8b5e3c]"
                />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-[#8b5e3c] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-[#7a5235] disabled:opacity-60">
                {loading ? 'Saving...' : editing ? 'Update Product' : 'Add Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
