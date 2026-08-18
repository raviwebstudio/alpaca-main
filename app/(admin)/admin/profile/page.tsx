'use client'

import { useEffect, useState } from 'react'
import {
  DEFAULT_ADMIN_PROFILE,
  readAdminProfile,
  saveAdminProfile,
  type AdminProfile,
} from '@/lib/adminProfile'

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<AdminProfile>(DEFAULT_ADMIN_PROFILE)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    setProfile(readAdminProfile())
    setLoading(false)
  }, [])

  const updateProfile = (field: keyof AdminProfile, value: string) => {
    setProfile((current) => ({ ...current, [field]: value }))
  }

  const handleSaveProfile = () => {
    setSaving(true)
    setMessage(null)

    try {
      const nextProfile = {
        ...DEFAULT_ADMIN_PROFILE,
        ...profile,
        email: profile.email.trim() || DEFAULT_ADMIN_PROFILE.email,
        username: profile.username.trim() || DEFAULT_ADMIN_PROFILE.username,
      }

      saveAdminProfile(nextProfile)
      setProfile(nextProfile)
      setMessage({ type: 'success', text: 'Profile updated successfully.' })
    } catch {
      setMessage({ type: 'error', text: 'Unable to save profile on this device.' })
    } finally {
      setSaving(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: '10px',
    border: '1px solid #E0D8D0', fontSize: '14px', outline: 'none',
    background: 'white', boxSizing: 'border-box' as const,
  }
  const labelStyle = {
    fontSize: '11px', textTransform: 'uppercase' as const,
    letterSpacing: '0.1em', color: '#78716C',
    fontWeight: 500 as const, display: 'block', marginBottom: '6px',
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px' }}>
      <p style={{ color: '#78716C' }}>Loading profile...</p>
    </div>
  )

  const initials = `${profile.firstName?.[0] ?? 'A'}${profile.lastName?.[0] ?? 'D'}`.toUpperCase()

  return (
    <div style={{ maxWidth: '640px' }}>
      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px',
        color: '#1C1917', marginBottom: '4px' }}>My Profile</h1>
      <p style={{ color: '#78716C', fontSize: '14px', marginBottom: '32px' }}>
        Manage your admin account details
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        {profile.profileImage ? (
          <img
            src={profile.profileImage}
            alt=""
            style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{
            width: '72px', height: '72px', borderRadius: '50%',
            background: '#C8956C', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '24px', color: 'white', fontWeight: 600,
          }}>
            {initials}
          </div>
        )}
        <div>
          <p style={{ fontWeight: 600, color: '#1C1917', fontSize: '16px' }}>
            {profile.firstName} {profile.lastName}
          </p>
          <p style={{ color: '#78716C', fontSize: '13px' }}>{profile.email}</p>
          <span style={{
            background: '#FEF3E2', color: '#C8956C',
            fontSize: '11px', padding: '2px 10px',
            borderRadius: '999px', fontWeight: 500,
          }}>ADMIN</span>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: '16px',
        padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#1C1917', marginBottom: '20px' }}>
          Personal Information
        </h2>

        {message && (
          <div style={{
            background: message.type === 'success' ? '#F0FDF4' : '#FEF2F2',
            border: `1px solid ${message.type === 'success' ? '#BBF7D0' : '#FECACA'}`,
            borderRadius: '10px', padding: '12px', marginBottom: '16px',
            color: message.type === 'success' ? '#15803D' : '#DC2626',
            fontSize: '13px'
          }}>
            {message.text}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={labelStyle}>First Name</label>
            <input value={profile.firstName} onChange={e => updateProfile('firstName', e.target.value)} placeholder="First name" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Last Name</label>
            <input value={profile.lastName} onChange={e => updateProfile('lastName', e.target.value)} placeholder="Last name" style={inputStyle} />
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Username</label>
          <input value={profile.username} onChange={e => updateProfile('username', e.target.value)} placeholder="alpaca-admin" style={inputStyle} />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Email Address</label>
          <input value={profile.email} onChange={e => updateProfile('email', e.target.value)} placeholder="admin@alpaca.com" style={inputStyle} />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Phone Number</label>
          <input value={profile.phone} onChange={e => updateProfile('phone', e.target.value)} placeholder="9999999999" maxLength={14} style={inputStyle} />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Address</label>
          <textarea value={profile.address} onChange={e => updateProfile('address', e.target.value)} placeholder="Admin address" rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={labelStyle}>Profile Image URL</label>
          <input value={profile.profileImage} onChange={e => updateProfile('profileImage', e.target.value)} placeholder="Optional image URL" style={inputStyle} />
        </div>

        <button
          onClick={handleSaveProfile}
          disabled={saving}
          style={{
            background: saving ? '#A8A29E' : '#C8956C',
            color: 'white', padding: '10px 28px',
            borderRadius: '999px', border: 'none',
            fontSize: '14px', fontWeight: 500,
            cursor: saving ? 'not-allowed' : 'pointer',
          }}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}
