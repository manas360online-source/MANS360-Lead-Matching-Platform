
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import AdminDashboard from './components/AdminDashboard';
import TherapistDashboard from './components/TherapistDashboard';
import { Engagement, Lead, Therapist } from './types';
import { mockEngagements, mockTherapists, mockLeads } from './services/mockData';

const App: React.FC = () => {
  const [role, setRole] = useState<'admin' | 'therapist'>('admin');
  const [engagements, setEngagements] = useState<Engagement[]>(mockEngagements);
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [therapists] = useState<Therapist[]>(mockTherapists);

  const handleAddEngagement = (newEng: Engagement) => {
    setEngagements(prev => [newEng, ...prev]);
  };

  const handleUpdateEngagement = (updatedEng: Engagement) => {
    setEngagements(prev => prev.map(e => e.engagement_id === updatedEng.engagement_id ? updatedEng : e));
  };

  const handleAddLeads = (newLeads: Lead[]) => {
    setLeads(prev => [...newLeads, ...prev]);
  };

  const handleApproveLead = (leadId: string) => {
    setLeads(prev => prev.map(l => {
      if (l.lead_id === leadId) {
        // Find the engagement to update its match count
        const eng = engagements.find(e => e.engagement_id === l.engagement_id);
        if (eng) {
          const updatedEng = {
            ...eng,
            therapists_matched: eng.therapists_matched + 1,
            status: (eng.therapists_matched + 1) >= eng.therapists_needed ? 'filled' : 'partially_filled' as any
          };
          handleUpdateEngagement(updatedEng);
        }
        return { ...l, admin_status: 'approved', is_assigned: true };
      }
      return l;
    }));
  };

  const handleAcceptLead = (leadId: string) => {
    setLeads(prev => prev.map(l => l.lead_id === leadId ? { ...l, therapist_status: 'accepted' } : l));
    alert('Lead accepted! Admin has been notified for final approval.');
  };

  const handleDeclineLead = (leadId: string) => {
    setLeads(prev => prev.map(l => l.lead_id === leadId ? { ...l, therapist_status: 'declined' } : l));
  };

  return (
    <Layout role={role} onRoleChange={setRole}>
      {role === 'admin' ? (
        <AdminDashboard 
          engagements={engagements} 
          therapists={therapists} 
          leads={leads}
          onAddEngagement={handleAddEngagement}
          onUpdateEngagement={handleUpdateEngagement}
          onAddLeads={handleAddLeads}
          onApproveLead={handleApproveLead}
        />
      ) : (
        <TherapistDashboard 
          therapist={therapists[0]} // Mocking logged in therapist as the first one
          leads={leads.filter(l => l.therapist_id === therapists[0].therapist_id)}
          onAcceptLead={handleAcceptLead}
          onDeclineLead={handleDeclineLead}
        />
      )}
    </Layout>
  );
};

export default App;
