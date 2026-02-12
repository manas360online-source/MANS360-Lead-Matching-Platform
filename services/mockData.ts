
import { Engagement, Therapist, Lead } from '../types';

export const mockTherapists: Therapist[] = [
  {
    therapist_id: 't1',
    name: 'Dr. Sarah Wilson',
    email: 'sarah.w@example.com',
    phone: '+91 9876543210',
    avg_rating: 4.8,
    total_sessions: 120,
    certifications: ['CBT', 'DBT', 'Corporate Wellness Coach'],
    languages: ['en', 'hi'],
    location_city: 'Mumbai',
    location_state: 'Maharashtra',
    location_lat: 19.0760,
    location_lng: 72.8777,
    certification_level: 'expert'
  },
  {
    therapist_id: 't2',
    name: 'Amit Patel',
    email: 'amit.p@example.com',
    phone: '+91 9876543211',
    avg_rating: 4.2,
    total_sessions: 45,
    certifications: ['Child/Adolescent Certified', 'CBT'],
    languages: ['hi', 'gu'],
    location_city: 'Ahmedabad',
    location_state: 'Gujarat',
    location_lat: 23.0225,
    location_lng: 72.5714,
    certification_level: 'standard'
  },
  {
    therapist_id: 't3',
    name: 'Jane Doe',
    email: 'jane.d@example.com',
    phone: '+91 9876543212',
    avg_rating: 4.6,
    total_sessions: 80,
    certifications: ['Executive Therapist', 'NLP', 'CBT'],
    languages: ['en', 'kn'],
    location_city: 'Bangalore',
    location_state: 'Karnataka',
    location_lat: 12.9716,
    location_lng: 77.5946,
    certification_level: 'advanced'
  }
];

export const mockEngagements: Engagement[] = [
  {
    engagement_id: 'e1',
    institution_id: 'i1',
    institution_name: 'Global Corp Tech',
    institution_type: 'corporate',
    engagement_type: 'Executive Coaching',
    engagement_title: 'Leadership Wellness Program',
    engagement_description: 'C-suite mental fitness sessions for executive leadership team.',
    certifications_required: ['Executive Therapist', 'NLP'],
    specializations_required: ['Leadership', 'Stress'],
    languages_required: ['en'],
    location_city: 'Bangalore',
    location_state: 'Karnataka',
    is_onsite: true,
    engagement_start_date: '2024-06-01',
    sessions_per_month: 4,
    session_rate_min: 5000,
    session_rate_max: 8000,
    therapists_needed: 1,
    therapists_matched: 0,
    status: 'open'
  }
];

export const mockLeads: Lead[] = [];
