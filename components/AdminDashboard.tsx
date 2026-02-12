
import React, { useState } from 'react';
import { Engagement, Lead, Therapist } from '../types';
import { matchTherapists } from '../services/matchingService';
import { INSTITUTION_ICONS, TIER_CONFIG } from '../constants';

interface AdminDashboardProps {
  engagements: Engagement[];
  therapists: Therapist[];
  leads: Lead[];
  onAddEngagement: (e: Engagement) => void;
  onUpdateEngagement: (e: Engagement) => void;
  onAddLeads: (ls: Lead[]) => void;
  onApproveLead: (leadId: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  engagements, 
  therapists, 
  leads, 
  onAddEngagement, 
  onUpdateEngagement, 
  onAddLeads,
  onApproveLead
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Partial<Engagement>>({
    institution_type: 'corporate',
    engagement_type: 'On-Site Wellness Days',
    is_onsite: true,
    therapists_needed: 1,
    certifications_required: ['CBT'],
    languages_required: ['en'],
    status: 'draft'
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newEngagement: Engagement = {
      ...formData as Engagement,
      engagement_id: `e${Date.now()}`,
      institution_id: `inst_${Date.now()}`,
      therapists_matched: 0,
    };
    onAddEngagement(newEngagement);
    setIsCreating(false);
  };

  const startMatching = (engagement: Engagement) => {
    const matchedLeads = matchTherapists(engagement, therapists);
    onAddLeads(matchedLeads);
    onUpdateEngagement({ ...engagement, status: 'matching' });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Institutional Engagements</h2>
          <p className="text-slate-400 mt-1">Manage corporate, educational and healthcare contracts</p>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-bold shadow-lg transition-all"
        >
          + New Engagement
        </button>
      </div>

      {isCreating && (
        <div className="bg-slate-900 border border-indigo-500/30 rounded-xl p-6 shadow-2xl animate-in slide-in-from-top duration-300">
          <h3 className="text-xl font-bold mb-6">Create New Engagement Request</h3>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Institution Name</label>
                <input required className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2" value={formData.institution_name} onChange={e => setFormData({...formData, institution_name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Engagement Title</label>
                <input required className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2" value={formData.engagement_title} onChange={e => setFormData({...formData, engagement_title: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Type</label>
                  <select className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2" value={formData.institution_type} onChange={e => setFormData({...formData, institution_type: e.target.value as any})}>
                    <option value="corporate">Corporate</option>
                    <option value="education">Education</option>
                    <option value="healthcare">Healthcare</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Therapists Needed</label>
                  <input type="number" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2" value={formData.therapists_needed} onChange={e => setFormData({...formData, therapists_needed: parseInt(e.target.value)})} />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Certifications Required (comma separated)</label>
                <input required className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2" value={formData.certifications_required?.join(', ')} onChange={e => setFormData({...formData, certifications_required: e.target.value.split(',').map(s => s.trim())})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Min Rate (₹)</label>
                  <input type="number" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2" value={formData.session_rate_min} onChange={e => setFormData({...formData, session_rate_min: parseInt(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Max Rate (₹)</label>
                  <input type="number" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2" value={formData.session_rate_max} onChange={e => setFormData({...formData, session_rate_max: parseInt(e.target.value)})} />
                </div>
              </div>
              <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => setIsCreating(false)} className="flex-1 bg-slate-800 hover:bg-slate-700 py-2 rounded-lg font-bold">Cancel</button>
                <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 py-2 rounded-lg font-bold">Save Engagement</button>
              </div>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <span>📋</span> Active Engagements
          </h3>
          {engagements.map(eng => (
            <div key={eng.engagement_id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className="text-4xl">{INSTITUTION_ICONS[eng.institution_type]}</div>
                  <div>
                    <h4 className="font-bold text-lg">{eng.engagement_title}</h4>
                    <p className="text-slate-400 text-sm">{eng.institution_name} • {eng.engagement_type}</p>
                    <div className="flex gap-2 mt-2">
                      {eng.certifications_required.map(c => (
                        <span key={c} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded uppercase tracking-wider">{c}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    eng.status === 'matching' ? 'bg-amber-500/20 text-amber-500' : 
                    eng.status === 'open' ? 'bg-indigo-500/20 text-indigo-500' :
                    eng.status === 'filled' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-slate-700 text-slate-300'
                  }`}>
                    {eng.status}
                  </span>
                  <p className="text-xs text-slate-500 mt-2">Matched: {eng.therapists_matched}/{eng.therapists_needed}</p>
                </div>
              </div>
              <div className="mt-6 flex justify-between items-center border-t border-slate-800 pt-4">
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-bold">T{i}</div>)}
                  <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-400">+5</div>
                </div>
                {eng.status === 'open' && (
                  <button 
                    onClick={() => startMatching(eng)}
                    className="bg-indigo-600 hover:bg-indigo-700 px-4 py-1.5 rounded text-sm font-bold"
                  >
                    🚀 Trigger Auto-Match
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <span>✅</span> Lead Approvals
          </h3>
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            {leads.filter(l => l.therapist_status === 'accepted').length === 0 ? (
              <div className="p-8 text-center text-slate-500 italic">No leads pending approval</div>
            ) : (
              <div className="divide-y divide-slate-800">
                {leads.filter(l => l.therapist_status === 'accepted' && l.admin_status === 'pending').map(l => (
                  <div key={l.lead_id} className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold">{l.therapist?.name}</p>
                        <p className="text-xs text-slate-400">{l.engagement?.engagement_title}</p>
                      </div>
                      <div className="bg-emerald-500/20 text-emerald-500 text-[10px] font-bold px-2 py-0.5 rounded">ACCEPTED</div>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-slate-950 p-2 rounded text-[10px]">
                        <p className="text-slate-500 uppercase tracking-tighter mb-1">Match Score</p>
                        <p className="font-bold text-emerald-400 text-lg">{l.match_score}%</p>
                      </div>
                      <div className="flex-1 bg-slate-950 p-2 rounded text-[10px]">
                        <p className="text-slate-500 uppercase tracking-tighter mb-1">Tier</p>
                        <p className="font-bold text-indigo-400 text-sm">{l.lead_tier.toUpperCase()}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => onApproveLead(l.lead_id)}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded font-bold text-sm shadow-lg"
                    >
                      Approve & Assign
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
