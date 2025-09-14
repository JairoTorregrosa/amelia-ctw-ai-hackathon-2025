import { BaseModel, type Row, type Insert, type Update } from './base';
import { UserRole } from '@/types/constants';

export type Profile = Row<'profiles'>;
export type ProfileInsert = Insert<'profiles'>;
export type ProfileUpdate = Update<'profiles'>;

/**
 * Profiles model class with CRUD operations and user management methods
 */
export class ProfilesModel extends BaseModel<'profiles'> {
  constructor() {
    super('profiles');
  }

  /**
   * Get profiles by role
   */
  async getByRole(role: UserRole): Promise<Profile[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('role', role)
      .order('full_name', { ascending: true });

    if (error) throw error;
    return (data || []) as Profile[];
  }

  /**
   * Get all patients
   */
  async getPatients(): Promise<Profile[]> {
    return this.getByRole(UserRole.Patient);
  }

  /**
   * Get all therapists
   */
  async getTherapists(): Promise<Profile[]> {
    return this.getByRole(UserRole.Therapist);
  }

  /**
   * Find profile by ID
   */
  async getById(id: string): Promise<Profile | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error && 'code' in error && error.code !== 'PGRST116') throw error;
    return (data as Profile) ?? null;
  }

  /**
   * Find profile by email
   */
  async getByEmail(email: string): Promise<Profile | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (error && 'code' in error && error.code !== 'PGRST116') throw error;
    return (data as Profile) ?? null;
  }

  /**
   * Find profile by phone number (digits only)
   * Queries for profiles with phone numbers and filters by matching digits
   */
  async getByPhone(phoneDigits: string): Promise<Profile | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('phone', phoneDigits)
      .maybeSingle();

    if (error) throw error;
    
    return data;
  }

  /**
   * Check if a profile exists with the given phone number (digits only)
   * Returns boolean indicating existence without fetching the full profile
   */
  async existsByPhone(phoneDigits: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('phone')
      .eq('phone', phoneDigits)
      .maybeSingle();

    if (error) throw error;
    
    return !!data?.phone || false;
  }

  /**
   * Search profiles by name
   */
  async searchByName(searchTerm: string): Promise<Profile[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .ilike('full_name', `%${searchTerm}%`)
      .order('full_name', { ascending: true });

    if (error) throw error;
    return (data || []) as Profile[];
  }

  /**
   * Update profile information
   */
  async updateProfile(id: string, updates: Partial<ProfileUpdate>): Promise<Profile> {
    return this.update(id, {
      ...updates,
      updated_at: new Date().toISOString(),
    } as ProfileUpdate);
  }

  /**
   * Create a new profile
   */
  async createProfile(profileData: {
    id: string;
    email: string;
    fullName: string;
    role: UserRole;
    phone?: string;
  }): Promise<Profile> {
    const { id, email, fullName, role, phone } = profileData;

    return this.create({
      id,
      email,
      full_name: fullName,
      role,
      phone: phone || null,
    } as ProfileInsert);
  }

  /**
   * Get profile with patient context if available
   */
  async getPatientWithContext(
    patientId: string,
  ): Promise<(Profile & { patient_context?: any }) | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(
        `
        *,
        patient_context (*)
      `,
      )
      .eq('id', patientId)
      .eq('role', UserRole.Patient)
      .maybeSingle();

    if (error && 'code' in error && error.code !== 'PGRST116') throw error;
    return data as (Profile & { patient_context?: any }) | null;
  }
}

// Create and export singleton instance
export const Profiles = new ProfilesModel();
