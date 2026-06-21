import { useEffect, useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { getCategories, adminCreateCategory, adminUpdateCategory, adminDeleteCategory } from '../../api/categories'
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi'

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const load = () => {
    getCategories()
      .then(setCategories)
      .catch(console.error)
  }

  useEffect(() => {
    load()
  }, [])

  const openAdd = () => {
    setEditing(null)
    setName('')
    setError('')
    setShowModal(true)
  }

  const openEdit = (cat) => {
    setEditing(cat)
    setName(cat.name)
    setError('')
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    setError('')
    try {
      if (editing) {
        await adminUpdateCategory(editing.id, { name: name.trim() })
      } else {
        await adminCreateCategory({ name: name.trim() })
      }
      setShowModal(false)
      load()
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (cat) => {
    if (!confirm(`Are you sure you want to delete the category "${cat.name}"?`)) return
    try {
      await adminDeleteCategory(cat.id)
      load()
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to delete category.')
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-[#333]">Categories</h1>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-[#8b5e3c] text-white px-4 py-2 rounded-xl text-sm hover:bg-[#7a5235] transition-colors"
          >
            <FiPlus /> Add Category
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden max-w-2xl">
          <table className="w-full text-sm">
            <thead className="bg-[#f6f2ee] text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-6 py-3 text-left">Category ID</th>
                <th className="px-6 py-3 text-left">Category Name</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-500 font-medium">#{cat.id}</td>
                  <td className="px-6 py-4 text-[#333] font-medium">{cat.name}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => openEdit(cat)}
                        className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Category"
                      >
                        <FiEdit2 className="text-sm" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat)}
                        className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Category"
                      >
                        <FiTrash2 className="text-sm" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-10 text-center text-gray-400">
                    No categories found. Click "Add Category" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#333]">
                {editing ? 'Edit Category' : 'Add Category'}
              </h2>
              <button onClick={() => setShowModal(false)}>
                <FiX className="text-gray-400 text-xl hover:text-gray-600 transition-colors" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2 rounded-lg">
                  ⚠️ {error}
                </div>
              )}
              
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. Rings"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#8b5e3c]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#8b5e3c] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-[#7a5235] disabled:opacity-60 transition-colors"
              >
                {loading ? 'Saving...' : editing ? 'Update Category' : 'Add Category'}
              </button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
