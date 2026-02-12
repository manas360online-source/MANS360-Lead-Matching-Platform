
export type InstitutionType = 'corporate' | 'education' | 'healthcare';

export type EngagementStatus = 'draft' | 'open' | 'matching' | 'partially_filled' | 'filled' | 'active' | 'completed' | 'cancelled';

export type LeadTier = 'exclusive' | 'priority' | 'standard';

export type LeadStatus = 'pending' | 'viewed' | 'interested' | 'accepted' | 'declined' | 'expired';

export type AdminLeadStatus = 'pending' | 'approved' | 'rejected' | 'waitlisted';

export interface Engagement {
  engagement_id: string;
  institution_id: string;
  institution_name: string;
  institution_type: InstitutionType;
  engagement_type: string;
  engagement_title: string;
  engagement_description: string;
  certifications_required: string[];
  specializations_required: string[];
  languages_required: string[];
  location_city: string;
  location_state: string;
  is_onsite: boolean;
  engagement_start_date: string;
  sessions_per_month: number;
  session_rate_min: number;
  session_rate_max: number;
  therapists_needed: number;
  therapists_matched: number;
  status: EngagementStatus;
}

export interface Therapist {
  therapist_id: string;
  name: string;
  email: string;
  phone: string;
  avg_rating: number;
  total_sessions: number;
  certifications: string[];
  languages: string[];
  location_city: string;
  location_state: string;
  location_lat: number;
  location_lng: number;
  certification_level: 'standard' | 'advanced' | 'expert';
}

export interface Lead {
  lead_id: string;
  engagement_id: string;
  therapist_id: string;
  match_score: number;
  match_reasons: {
    certification: number;
    language: number;
    proximity: number;
    rating: number;
    availability: number;
  };
  lead_tier: LeadTier;
  visible_from: string;
  visible_until: string | null;
  therapist_status: LeadStatus;
  admin_status: AdminLeadStatus;
  is_assigned: boolean;
  engagement?: Engagement;
  therapist?: Therapist;
}
