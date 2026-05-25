import React from 'react';
import { useUser } from '../context/UserContext';
import './SubscriptionInfo.css';

export default function SubscriptionInfo() {
  const { user, getPlanDetails, getRemainingPrompts } = useUser();

  if (!user) return null;

  const planDetails = getPlanDetails(user.subscription?.plan || 'free');
  const remaining = getRemainingPrompts();
  const usagePercent = (user.promptsUsed / planDetails.prompts) * 100;

  return (
    <div className="subscription-info-card">
      <div className="info-header">
        <div className="plan-icon">{planDetails.badge.split(' ')[0]}</div>
        <div>
          <h4 className="plan-name">{planDetails.name} Plan</h4>
          <p className="plan-duration">{planDetails.duration}</p>
        </div>
      </div>

      <div className="usage-stats">
        <div className="stat-item">
          <span className="stat-label">Prompts Used</span>
          <span className="stat-value">{user.promptsUsed || 0}</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <span className="stat-label">Total Available</span>
          <span className="stat-value">{planDetails.prompts}</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <span className="stat-label">Remaining</span>
          <span className="stat-value remaining">{remaining}</span>
        </div>
      </div>

      <div className="usage-bar">
        <div className="usage-fill" style={{ width: `${Math.min(usagePercent, 100)}%` }}></div>
      </div>

      {remaining <= 0 && user.subscription?.plan === 'free' && (
        <div className="upgrade-prompt">
          <p>🔒 Free prompts limit reached!</p>
          <p className="upgrade-text">Upgrade your plan to continue accessing prompts</p>
        </div>
      )}

      {remaining <= 5 && remaining > 0 && (
        <div className="warning-prompt">
          <p>⚠️ Only {remaining} prompts remaining!</p>
          <p className="warning-text">Consider upgrading for unlimited access</p>
        </div>
      )}

      {user.subscription?.plan === 'free' && remaining > 5 && (
        <div className="free-info">
          <p>Get more prompts! Upgrade to a premium plan</p>
          <p className="free-text">Unlock 25+ prompts and premium features</p>
        </div>
      )}
    </div>
  );
}
