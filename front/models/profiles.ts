import { makeRepository } from './base';
import type { Row, Insert, Update } from './base';

export const Profiles = makeRepository('profiles');

export type Profile = Row<'profiles'>;
export type ProfileInsert = Insert<'profiles'>;
export type ProfileUpdate = Update<'profiles'>;

export enum UserRoleEnum {
  Patient = 'patient',
  Therapist = 'therapist',
}
