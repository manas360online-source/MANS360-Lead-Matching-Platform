
import { Engagement, Therapist, Lead, LeadTier } from '../types';
import { WEIGHTS } from '../constants';

export function calculateCertificationScore(therapist: Therapist, engagement: Engagement): number {
  const required = engagement.certifications_required;
  const has = therapist.certifications || [];
  const matches = required.filter(cert => has.includes(cert));
  const baseScore = (matches.length / (required.length || 1)) * 80;

  const levelBonus = therapist.certification_level === 'advanced' ? 20 :
                     therapist.certification_level === 'expert' ? 20 : 10;
  
  return Math.min(100, baseScore + levelBonus);
}

export function calculateLanguageScore(therapistLangs: string[], requiredLangs: string[]): number {
  if (!therapistLangs || !requiredLangs) return 0;
  const matches = requiredLangs.filter(lang => therapistLangs.includes(lang));
  if (matches.length === 0) return 0;
  return (matches.length / requiredLangs.length) * 100;
}

export function calculateRatingScore(avgRating: number, totalSessions: number): number {
  if (!avgRating || totalSessions < 10) return 50;
  const ratingScore = (avgRating / 5) * 80;
  const expBonus = Math.min(20, (totalSessions / 50) * 20);
  return Math.round(ratingScore + expBonus);
}

export function determineLeadTier(therapist: Therapist, score: number): LeadTier {
  if (therapist.avg_rating >= 4.5 && score >= 80) return 'exclusive';
  if (score >= 70) return 'priority';
  return 'standard';
}

export function matchTherapists(engagement: Engagement, therapists: Therapist[]): Lead[] {
  const now = new Date();
  const leads: Lead[] = [];

  for (const therapist of therapists) {
    // 1. Certification Filter (Primary)
    const certScore = calculateCertificationScore(therapist, engagement);
    if (certScore < 40) continue; // Basic threshold

    // 2. Language Match (Must match at least one)
    const langScore = calculateLanguageScore(therapist.languages, engagement.languages_required);
    if (langScore === 0) continue;

    // 3. Simulated Proximity and Availability
    const proximityScore = 100; // Simulated for this MVP
    const availabilityScore = 100;

    const ratingScore = calculateRatingScore(therapist.avg_rating, therapist.total_sessions);

    const totalScore = (
      (certScore * WEIGHTS.certification / 100) +
      (langScore * WEIGHTS.language / 100) +
      (proximityScore * WEIGHTS.proximity / 100) +
      (ratingScore * WEIGHTS.rating / 100) +
      (availabilityScore * WEIGHTS.availability / 100)
    );

    const leadTier = determineLeadTier(therapist, totalScore);

    // 4. Set Visibility Windows
    let visibleFrom = now.toISOString();
    let visibleUntil: string | null = null;

    if (leadTier === 'exclusive') {
      visibleUntil = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
    } else if (leadTier === 'priority') {
      visibleFrom = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
      visibleUntil = new Date(now.getTime() + 48 * 60 * 60 * 1000).toISOString();
    } else {
      visibleFrom = new Date(now.getTime() + 48 * 60 * 60 * 1000).toISOString();
    }

    leads.push({
      lead_id: `lead_${engagement.engagement_id}_${therapist.therapist_id}`,
      engagement_id: engagement.engagement_id,
      therapist_id: therapist.therapist_id,
      match_score: Math.round(totalScore),
      match_reasons: {
        certification: certScore,
        language: langScore,
        proximity: proximityScore,
        rating: ratingScore,
        availability: availabilityScore
      },
      lead_tier: leadTier,
      visible_from: visibleFrom,
      visible_until: visibleUntil,
      therapist_status: 'pending',
      admin_status: 'pending',
      is_assigned: false,
      therapist: therapist
    });
  }

  return leads.sort((a, b) => b.match_score - a.match_score);
}
