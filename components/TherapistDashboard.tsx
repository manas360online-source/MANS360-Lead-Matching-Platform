
import React, { useState, useEffect } from 'react';
import { Lead, Therapist } from '../types';
import { TIER_CONFIG, INSTITUTION_ICONS } from '../constants';

interface TherapistDashboardProps {
  therapist: Therapist;
  leads: Lead[];
  onAcceptLead: (leadId: string) => void;
  onDeclineLead: (leadId: string) => void;
}

const TherapistDashboard: React.FC<TherapistDashboardProps> = ({ 
  therapist, 
  leads, 
  onAcceptLead, 
  onDeclineLead 
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const visibleLeads = leads.filter(l => {
    const visibleFrom = new Date(l.visible_from);
    const visibleUntil = l.visible_until ? new Date(l.visible_until) : null;
    return currentTime >= visibleFrom && (!visibleUntil || currentTime <= visibleUntil) && (l.therapist_status === 'pending' || l.therapist_status === 'viewed');
  });

  const assignedEngagements = leads.filter(l => l.is_assigned);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-indigo-900/40 to-slate-900 border border-indigo-500/20 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-indigo-600 flex items-center justify-center text-3xl font-bold shadow-2xl">
            {therapist.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-2xl font-bold">Welcome back, {therapist.name}</h2>
            <p className="text-slate-400 mt-1">{therapist.certification_level.toUpperCase()} LEVEL • {therapist.avg_rating} ⭐ RATING</p>
            <div className="flex gap-2 mt-3">
              {therapist.certifications.map(c => (
                <span key={c} className="text-[10px] bg-slate-950 text-slate-400 px-2 py-0.5 rounded-full border border-slate-800 uppercase tracking-widest">{c}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Exclusive', count: visibleLeads.filter(l => l.lead_tier === 'exclusive').length, color: 'text-violet-400', icon: '⭐' },
          { label: 'Priority', count: visibleLeads.filter(l => l.lead_tier === 'priority').length, color: 'text-amber-400', icon: '🔥' },
          { label: 'Active', count: assignedEngagements.length, color: 'text-emerald-400', icon: '✅' },
        ].map(stat => (
          <div key={stat.label} className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center">
            <p className="text-xs text-slate-500 uppercase tracking-tighter mb-1">{stat.label}</p>
            <p className={`text-2xl font-black ${stat.color}`}>{stat.icon} {stat.count}</p>
          </div>
        ))}
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <span>📬</span> New Opportunities
        </h3>

        {visibleLeads.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
            <div className="text-5xl opacity-20">🏢</div>
            <p className="text-slate-400">No new institutional leads matching your certifications right now.</p>
            <p className="text-xs text-slate-600">Tip: Complete more certifications to unlock more high-value B2B deals.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {visibleLeads.map(lead => {
              const tier = TIER_CONFIG[lead.lead_tier];
              const remainingHours = lead.visible_until 
                ? Math.round((new Date(lead.visible_until).getTime() - currentTime.getTime()) / (1000 * 60 * 60))
                : null;

              return (
                <div key={lead.lead_id} className="relative bg-slate-900 rounded-2xl overflow-hidden border-l-4 border-slate-800 hover:border-l-indigo-500 transition-all shadow-lg group" style={{ borderLeftColor: tier.color }}>
                  <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur border border-slate-800 px-3 py-1 rounded-full flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">{lead.match_score}%</span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Match</span>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black tracking-widest text-white" style={{ backgroundColor: tier.color }}>
                        {tier.icon} {tier.label}
                      </span>
                      {remainingHours !== null && (
                        <span className="text-[10px] text-rose-400 font-bold bg-rose-400/10 px-2 py-0.5 rounded uppercase flex items-center gap-1">
                          ⏱️ {remainingHours}h remaining
                        </span>
                      )}
                    </div>

                    <div className="flex gap-4 items-start mb-6">
                      <div className="text-4xl bg-slate-950 w-14 h-14 rounded-xl flex items-center justify-center shadow-inner">
                        {INSTITUTION_ICONS[lead.engagement?.institution_type || 'corporate']}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold group-hover:text-indigo-400 transition-colors">{lead.engagement?.engagement_title}</h4>
                        <p className="text-slate-400 text-sm">{lead.engagement?.institution_name}</p>
                        <p className="text-xs text-slate-500 mt-1">{lead.engagement?.engagement_type} • {lead.engagement?.is_onsite ? `${lead.engagement.location_city}` : 'Virtual'}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                        <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-1">Start Date</p>
                        <p className="text-sm font-bold text-slate-200">{(new Date(lead.engagement?.engagement_start_date || '')).toLocaleDateString()}</p>
                      </div>
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                        <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-1">Sessions</p>
                        <p className="text-sm font-bold text-slate-200">{lead.engagement?.sessions_per_month}/month</p>
                      </div>
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 md:col-span-2">
                        <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-1">Compensation</p>
                        <p className="text-sm font-bold text-emerald-400">₹{lead.engagement?.session_rate_min.toLocaleString()} - ₹{lead.engagement?.session_rate_max.toLocaleString()} <span className="text-slate-500 text-[10px]">/session</span></p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button 
                        onClick={() => onDeclineLead(lead.lead_id)}
                        className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 rounded-xl font-bold transition-all"
                      >
                        Not Interested
                      </button>
                      <button 
                        onClick={() => onAcceptLead(lead.lead_id)}
                        className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-indigo-600/20 transition-all transform active:scale-95"
                      >
                        Accept Opportunity
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="space-y-6 pt-12">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <span>💼</span> My Institutional Portfolio
        </h3>
        {assignedEngagements.length === 0 ? (
          <div className="p-8 text-center text-slate-600 border border-slate-800 border-dashed rounded-2xl">
            You don't have any active institutional engagements yet.
          </div>
        ) : (
          <div className="grid gap-4">
            {assignedEngagements.map(l => (
              <div key={l.lead_id} className="bg-slate-900/50 border border-emerald-500/20 rounded-xl p-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                   <div className="text-2xl">{INSTITUTION_ICONS[l.engagement?.institution_type || 'corporate']}</div>
                   <div>
                     <p className="font-bold text-slate-200">{l.engagement?.engagement_title}</p>
                     <p className="text-xs text-slate-500">{l.engagement?.institution_name}</p>
                   </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded font-bold uppercase">Active</span>
                  <p className="text-xs text-slate-500 mt-1">Started: {new Date(l.engagement?.engagement_start_date || '').toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TherapistDashboard;
