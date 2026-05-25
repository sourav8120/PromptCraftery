import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import './PromptsAdmin.css';

export default function PromptsAdmin() {
  const { api } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-prompts', search, page],
    queryFn: () => api.get('/admin/prompts', { params: { search, page, limit: 20 } }).then(r => r.data)
  });

  const prompts = data?.prompts || [];
  const total = data?.total || 0;
  const pages = data?.pages || 1;

  const handleDelete = async (id) => {
    try {
      await api.delete(`/prompts/${id}`);
      toast.success('Prompt deleted');
      queryClient.invalidateQueries(['admin-prompts']);
      queryClient.invalidateQueries(['admin-stats']);
      setDeleteId(null);
    } catch {
      toast.error('Delete failed');
    }
  };

  const handleToggle = async (id, current) => {
    try {
      await api.put(`/prompts/${id}`, { isActive: !current });
      toast.success(`Prompt ${current ? 'deactivated' : 'activated'}`);
      queryClient.invalidateQueries(['admin-prompts']);
    } catch {
      toast.error('Update failed');
    }
  };

  const handleToggleFeatured = async (id, current) => {
    try {
      await api.put(`/prompts/${id}`, { isFeatured: !current });
      toast.success(`${current ? 'Removed from' : 'Added to'} featured`);
      queryClient.invalidateQueries(['admin-prompts']);
    } catch {
      toast.error('Update failed');
    }
  };

  return (
    <div className="prompts-admin">
      <div className="page-header">
        <div>
          <h1 className="page-title">Prompts</h1>
          <p className="page-sub">{total} total prompts</p>
        </div>
        <Link to="/prompts/new" className="btn btn-primary">+ Add Prompt</Link>
      </div>

      {/* Toolbar */}
      <div className="pa-toolbar card" style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '14px 16px', marginBottom: 16 }}>
        <input
          type="text"
          className="form-input"
          placeholder="Search prompts..."
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { setSearch(searchInput); setPage(1); } }}
          style={{ flex: 1 }}
        />
        <button className="btn btn-primary" onClick={() => { setSearch(searchInput); setPage(1); }}>Search</button>
        {search && <button className="btn btn-outline" onClick={() => { setSearch(''); setSearchInput(''); setPage(1); }}>Clear</button>}
      </div>

      {/* Table */}
      <div className="pa-table card" style={{ padding: 0, overflow: 'hidden' }}>
        {isLoading ? (
          <div className="loading"><div className="spinner" /></div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Difficulty</th>
                  <th>Views</th>
                  <th>Copies</th>
                  <th>Featured</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {prompts.map(p => (
                  <tr key={p._id}>
                    <td className="title-cell">
                      <span title={p.title}>{p.title}</span>
                    </td>
                    <td>
                      <span className="cat-chip">{p.category?.icon} {p.category?.name || '—'}</span>
                    </td>
                    <td>
                      <span className={`badge diff-badge-${p.difficulty}`}>{p.difficulty}</span>
                    </td>
                    <td>{p.views}</td>
                    <td>{p.copies}</td>
                    <td>
                      <button
                        className={`toggle-btn ${p.isFeatured ? 'on' : ''}`}
                        onClick={() => handleToggleFeatured(p._id, p.isFeatured)}
                        title={p.isFeatured ? 'Remove from featured' : 'Add to featured'}
                      >
                        {p.isFeatured ? '★' : '☆'}
                      </button>
                    </td>
                    <td>
                      <button
                        className={`status-toggle ${p.isActive ? 'active' : 'inactive'}`}
                        onClick={() => handleToggle(p._id, p.isActive)}
                      >
                        {p.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td>
                      <div className="action-row">
                        <Link to={`/prompts/edit/${p._id}`} className="btn btn-outline" style={{ padding: '5px 10px', fontSize: '0.75rem' }}>Edit</Link>
                        <button className="btn btn-danger" style={{ padding: '5px 10px', fontSize: '0.75rem' }} onClick={() => setDeleteId(p._id)}>Del</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="pa-pagination">
          <button className="btn btn-outline" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
          <span style={{ color: 'var(--text-2)', fontSize: '0.875rem' }}>Page {page} of {pages}</span>
          <button className="btn btn-outline" disabled={page === pages} onClick={() => setPage(p => p + 1)}>Next →</button>
        </div>
      )}

      {/* Delete Modal */}
      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <h3>Delete Prompt?</h3>
            <p>This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteId)}>Yes, Delete</button>
              <button className="btn btn-outline" onClick={() => setDeleteId(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
