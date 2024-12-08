import { useState, useEffect } from 'react';
import './partner.css';

export function PartnerConnection() {
  const [partnerEmail, setPartnerEmail] = useState('');
  const [currentPartner, setCurrentPartner] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch partner status on component mount
  useEffect(() => {
    const fetchPartner = async () => {
      try {
        const response = await fetch('/api/partner');
        if (response.ok) {
          const partner = await response.json();
          if (partner && partner.email) {
            setCurrentPartner(partner);
          }
        }
      } catch (err) {
        console.error('Error fetching partner:', err);
        setError('Failed to check partner status');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPartner();
  }, []);

  const handlePartnerEmailChange = (e) => {
    const email = e.target.value;
    setPartnerEmail(email);
    if (email === localStorage.getItem('userEmail')) {
      setError("You can't connect with your own email");
    } else {
      setError('');
    }
  };

  const handleConnect = async (e) => {
    e.preventDefault();
    setError('');

    const userEmail = localStorage.getItem('userEmail');
    if (partnerEmail === userEmail) {
      setError("You can't connect with your own email");
      return;
    }

    if (!partnerEmail.trim()) {
      setError('Please enter your partner\'s email');
      return;
    }

    try {
      const response = await fetch('/api/partner/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          partnerEmail: partnerEmail.trim()
        })
      });

      if (response.ok) {
        const checkResponse = await fetch('/api/partner');
        if (checkResponse.ok) {
          const partner = await checkResponse.json();
          setCurrentPartner(partner);
          setPartnerEmail('');
        }
      } else {
        const data = await response.json();
        setError(data.msg || 'Failed to connect with partner');
      }
    } catch (err) {
      setError('Failed to connect with partner');
      console.error('Error:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="partner-section">
        <p>Loading partner status...</p>
      </div>
    );
  }

  if (currentPartner) {
    return (
      <div className="partner-section">
        <div className="partner-info">
          <h3>Already Connected with Him/Her</h3>
          <p>Connected since: {new Date(currentPartner.created).toLocaleDateString()}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="partner-section">
      <form onSubmit={handleConnect} className="partner-form">
        <h3>Connect with Your Partner</h3>
        <div className="input-group">
          <input
            type="email"
            value={partnerEmail}
            onChange={handlePartnerEmailChange}
            placeholder="Enter your partner's email"
            required
          />
          <button type="submit" disabled={partnerEmail === localStorage.getItem('userEmail')}>
            Connect
          </button>
        </div>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
}