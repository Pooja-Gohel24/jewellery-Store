import { useEffect, useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { getAdminUsers, deleteUser } from '../../api/admin'
import { FiTrash2 } from 'react-icons/fi'

export default function AdminUsers() {
  const [users, setUsers] = useState([])

  const load = () => getAdminUsers().then(setUsers).catch(console.error)

  useEffect(() => { load() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this user?')) return
    await deleteUser(id)
    load()
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-[#333]">Users</h1>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#f6f2ee] text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-5 py-3 text-left">Name</th>
                <th className="px-5 py-3 text-left">Email</th>
                <th className="px-5 py-3 text-left">Joined</th>
                <th className="px-5 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-[#333]">{u.name}</td>
                  <td className="px-5 py-3 text-gray-500">{u.email}</td>
                  <td className="px-5 py-3 text-gray-400">{new Date(u.created_at).toLocaleDateString('en-IN')}</td>
                  <td className="px-5 py-3">
                    <button onClick={() => handleDelete(u.id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg"><FiTrash2 /></button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan={4} className="px-5 py-8 text-center text-gray-400">No users found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}
