import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useUser } from '../context/UserContext';
import { incrementCopy, likePrompt } from '../services/api';
import SubscriptionModal from './SubscriptionModal';
import './PromptCard.css';

const DIFFICULTY_COLORS = {
  beginner: '#10b981',
  intermediate: '#f59e0b',
  advanced: '#ef4444'
};

export default function PromptCard({ prompt }) {
  const navigate = useNavigate();
  const { user, incrementPromptUsage } = useUser();
  const [likes, setLikes] = useState(prompt.likes || 0);
  const [userLiked, setUserLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [isCheckingLimit, setIsCheckingLimit] = useState(false);

  const handleCopy = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if user is logged in
    if (!user) {
      toast.error('Please login to copy prompts');
      navigate('/login');
      return;
    }

    setIsCheckingLimit(true);
    // Check if user has prompts remaining
    const result = await incrementPromptUsage(prompt._id);
    setIsCheckingLimit(false);
    
    if (!result.success) {
      toast.error(result.error || "You've used all your allowed prompts!");
      // Immediately show subscription modal
      setTimeout(() => setShowSubscriptionModal(true), 100);
      return;
    }

    try {
      await navigator.clipboard.writeText(prompt.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      await incrementCopy(prompt._id);
      toast.success('Prompt copied!');
    } catch {
      toast.error('Failed to copy');
    }
  };

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error('Please login to like prompts');
      navigate('/login');
      return;
    }
    
    try {
      const data = await likePrompt(prompt._id);
      setLikes(data.likes);
      setUserLiked(data.liked);
      toast.success(data.message || 'Updated!');
    } catch (error) {
      const msg = error.response?.data?.error || 'Error updating like';
      toast.error(msg);
    }
  };

  const categoryColor = prompt.category?.color || '#7c3aed';

  return (
    <>
      <Link to={`/prompts/${prompt.slug}`} className="prompt-card">
        <div className="prompt-card-header">
          {prompt.category && (
            <span className="prompt-cat-badge" style={{ background: `${categoryColor}20`, color: categoryColor, borderColor: `${categoryColor}40` }}>
              {prompt.category.icon} {prompt.category.name}
            </span>
          )}
          {prompt.isFeatured && <span className="featured-badge">★ Featured</span>}
        </div>

        {prompt.resultImage && (
          <div className="prompt-card-image">
            <img src={prompt.resultImage} alt={prompt.title} />
          </div>
        )}

        <h3 className="prompt-card-title">{prompt.title}</h3>

        {prompt.description && (
          <p className="prompt-card-desc">{prompt.description}</p>
        )}

        <div className="prompt-card-preview">
          {prompt.content.substring(0, 120)}...
        </div>

        <div className="prompt-card-tags">
          {prompt.tags?.slice(0, 3).map(tag => (
            <span key={tag} className="tag">#{tag}</span>
          ))}
        </div>

        <div className="prompt-card-footer">
          <div className="prompt-card-meta">
            <span className="difficulty-dot" style={{ color: DIFFICULTY_COLORS[prompt.difficulty] }}>
              ● {prompt.difficulty}
            </span>
            <span className="meta-item">👁 {prompt.views}</span>
            <span className="meta-item">📋 {prompt.copies}</span>
          </div>
          <div className="prompt-card-actions">
            <button className={`action-btn like-btn ${userLiked ? 'liked' : ''}`} onClick={handleLike} title={userLiked ? "Unlike" : "Like"}>
              {userLiked ? '❤ ' : '♥ '}{likes}
            </button>
            <button className={`action-btn copy-btn ${copied ? 'copied' : ''}`} onClick={handleCopy}>
              {copied ? '✓ Copied' : '⧉ Copy'}
            </button>
          </div>
        </div>
      </Link>
      <SubscriptionModal isOpen={showSubscriptionModal} onClose={() => setShowSubscriptionModal(false)} promptsUsed={user?.promptsUsed || 0} />
    </>
  );
}
