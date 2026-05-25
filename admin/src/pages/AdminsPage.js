import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function AdminsPage() {
  const { api, admin: currentAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'admin' });
  const [saving, setSaving] = useState(false);
  const [showPwForm, setShowPwForm] = useState(false);
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '' });

  const { data: admins = [], isLoading } = useQuery({
    queryKey: ['admins'],
    queryFn: () => api.get('/admin/admins').then(r => r.data.admins),
    retry: false
  });

  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }));

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/admin/admins', form);
      toast.success('Admin created');
      queryClient.invalidateQueries(['admins']);
      setShowForm(false);
      setForm({ name: '', email: '', password: '', role: 'admin' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this admin?')) return;
    try {
      await api.delete(`/admin/admins/${id}`);
      toast.success('Admin deleted');
      queryClient.invalidateQueries(['admins']);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed');
    }
  };

  const handleChangePw = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/auth/change-password', pwForm);
      toast.success('Password changed!');
      setShowPwForm(false);
      setPwForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed');
    } finally { setSaving(false); }
  };

  return (
    <div className="admins-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Admins</h1>
          <p className="page-sub">Manage admin accounts</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-outline" onClick={() => setShowPwForm(true)}>Change My Password</button>
          {currentAdmin?.role === 'superadmin' && (
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Add Admin</button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="loading"><div className="spinner" /></div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Last Login</th>
                <th>Status</th>
                {currentAdmin?.role === 'superadmin' && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {admins.map(a => (
                <tr key={a._id}>
                  <td style={{ color: 'var(--text)', fontWeight: 500 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, flexShrink: 0 }}>
                        {a.name?.[0]?.toUpperCase()}
                      </div>
                      {a.name} {a._id === currentAdmin?.id && <span className="badge badge-purple">You</span>}
                    </div>
                  </td>
                  <td>{a.email}</td>
                  <td><span className={`badge ${a.role === 'superadmin' ? 'badge-purple' : 'badge-yellow'}`}>{a.role}</span></td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    {a.lastLogin ? new Date(a.lastLogin).toLocaleDateString() : 'Never'}
                  </td>
                  <td><span className={`badge ${a.isActive ? 'badge-green' : 'badge-red'}`}>{a.isActive ? 'Active' : 'Inactive'}</span></td>
                  {currentAdmin?.role === 'superadmin' && (
                    <td>
                      {a._id !== currentAdmin?.id && (
                        <button className="btn btn-danger" style={{ padding: '4px 10px', fontSize: '0.75rem' }} onClick={() => handleDelete(a._id)}>Delete</button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Admin Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}>
            <h3>New Admin</h3>
            <form onSubmit={handleCreate} style={{ marginTop: 16 }}>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input type="text" className="form-input" value={form.name} onChange={set('name')} required />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" className="form-input" value={form.email} onChange={set('email')} required />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input type="password" className="form-input" value={form.password} onChange={set('password')} required minLength={6} />
              </div>
              <div className="form-group">
                <label className="form-label">Role</label>
                <select className="form-input" value={form.role} onChange={set('role')}>
                  <option value="admin">Admin</option>
                  <option value="superadmin">Super Admin</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button type="submit" className="btn btn-primary" disabled={saving} style={{ flex: 1, justifyContent: 'center' }}>{saving ? 'Creating...' : 'Create Admin'}</button>
                <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPwForm && (
        <div className="modal-overlay" onClick={() => setShowPwForm(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: 380 }}>
            <h3>Change Password</h3>
            <form onSubmit={handleChangePw} style={{ marginTop: 16 }}>
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input type="password" className="form-input" value={pwForm.currentPassword} onChange={e => setPwForm(p => ({ ...p, currentPassword: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input type="password" className="form-input" value={pwForm.newPassword} onChange={e => setPwForm(p => ({ ...p, newPassword: e.target.value }))} required minLength={6} />
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button type="submit" className="btn btn-primary" disabled={saving} style={{ flex: 1, justifyContent: 'center' }}>{saving ? 'Saving...' : 'Change Password'}</button>
                <button type="button" className="btn btn-outline" onClick={() => setShowPwForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
