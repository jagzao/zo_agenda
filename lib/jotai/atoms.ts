import { atom } from 'jotai'

// User atom
export const userAtom = atom<any>(null)

// Tenant atom
export const tenantAtom = atom<any>(null)

// Calendar view atom
export const calendarViewAtom = atom<'month' | 'week' | 'day' | 'agenda'>('month')

// Selected date atom
export const selectedDateAtom = atom<Date>(new Date())
