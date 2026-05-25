import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

export default function Dashboard() {
  const { api, admin } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => api.get('/admin/stats').then(r => r.data)
  });

  const stats = data?.stats || {};
  const recentPrompts = data?.recentPrompts || [];

  const statCards = [
    { label: 'Total Prompts', value: stats.totalPrompts || 0, icon: '✦', color: '#a855f7' },
    { label: 'Categories', value: stats.totalCategories || 0, icon: '◈', color: '#06b6d4' },
    { label: 'Total Views', value: (stats.totalViews || 0).toLocaleString(), icon: '👁', color: '#f59e0b' },
    { label: 'Total Copies', value: (stats.totalCopies || 0).toLocaleString(), icon: '📋', color: '#10b981' },
  ];

  return (
    <div className="dashboard">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-sub">Welcome back, <strong>{admin?.name}</strong></p>
        </div>
        <Link to="/prompts/new" className="btn btn-primary">+ New Prompt</Link>
      </div>

      {isLoading ? (
        <div className="loading"><div className="spinner" /></div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="stat-grid">
            {statCards.map(s => (
              <div key={s.label} className="stat-card" style={{ '--sc': s.color }}>
                <div className="stat-icon">{s.icon}</div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
                <div className="stat-glow" />
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <h2>Quick Actions</h2>
            <div className="qa-grid">
              <Link to="/prompts/new" className="qa-card">
                <span className="qa-icon">✦</span>
                <span>Add New Prompt</span>
              </Link>
              <Link to="/categories" className="qa-card">
                <span className="qa-icon">◈</span>
                <span>Manage Categories</span>
              </Link>
              <Link to="/prompts" className="qa-card">
                <span className="qa-icon">⊡</span>
                <span>View All Prompts</span>
              </Link>
              <a href="http://localhost:3000" target="_blank" rel="noreferrer" className="qa-card">
                <span className="qa-icon">↗</span>
                <span>View Live Site</span>
              </a>
            </div>
          </div>

          {/* Recent Prompts */}
          <div className="recent-section">
            <div className="recent-header">
              <h2>Recent Prompts</h2>
              <Link to="/prompts" className="btn btn-outline">View All</Link>
            </div>
            <div className="recent-table">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Views</th>
                    <th>Copies</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPrompts.map(p => (
                    <tr key={p._id}>
                      <td className="prompt-title-cell">{p.title}</td>
                      <td>
                        <span className="cat-chip">{p.category?.icon} {p.category?.name}</span>
                      </td>
                      <td>{p.views}</td>
                      <td>{p.copies}</td>
                      <td>
                        <span className={`badge ${p.isActive ? 'badge-green' : 'badge-red'}`}>
                          {p.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <Link to={`/prompts/edit/${p._id}`} className="btn btn-outline" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
