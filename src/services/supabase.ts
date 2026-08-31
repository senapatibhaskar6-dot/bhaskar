import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Property, TenantUser, Appointment, PaymentRecord, SupabaseConfig } from '../types';

let cachedClient: SupabaseClient | null = null;
let currentConfigKey = '';

export function getSupabaseClient(config: SupabaseConfig): SupabaseClient | null {
  if (!config.url || !config.anonKey) {
    return null;
  }
  const key = `${config.url}___${config.anonKey}`;
  if (cachedClient && currentConfigKey === key) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(config.url.trim(), config.anonKey.trim());
    currentConfigKey = key;
    return cachedClient;
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
    return null;
  }
}

export async function testSupabaseConnection(config: SupabaseConfig): Promise<{ success: boolean; message: string }> {
  if (!config.url || !config.anonKey) {
    return { success: false, message: 'Please provide both Supabase Project URL and Anon Public Key.' };
  }

  try {
    const client = getSupabaseClient(config);
    if (!client) {
      return { success: false, message: 'Invalid Supabase client credentials.' };
    }

    // Try a simple ping query on public tables or auth
    const { error } = await client.from('properties').select('id').limit(1);
    
    if (error && error.code !== 'PGRST116' && !error.message.includes('relation "properties" does not exist')) {
      // If table doesn't exist yet, it means credentials are valid but tables need creation
      return { 
        success: true, 
        message: 'Connected to Supabase! (Note: Remember to run the SQL Table Schema script below if tables are not created yet).' 
      };
    }

    return { 
      success: true, 
      message: 'Successfully connected to Supabase database!' 
    };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Failed to reach Supabase endpoint.' };
  }
}

export async function syncPropertyToSupabase(property: Property, config: SupabaseConfig): Promise<boolean> {
  const client = getSupabaseClient(config);
  if (!client) return false;

  try {
    const { error } = await client.from('properties').upsert({
      id: property.id,
      title: property.title,
      property_type: property.propertyType,
      sharing_type: property.sharingType,
      address: property.address,
      city: property.city,
      landmark: property.landmark || null,
      monthly_rent: property.monthlyRent,
      security_deposit: property.securityDeposit,
      owner_name: property.ownerName,
      owner_phone: property.ownerPhone,
      owner_whatsapp: property.ownerWhatsapp,
      images: property.images,
      facilities: property.facilities,
      description: property.description,
      is_verified: property.isVerified,
      listing_utr: property.listingUtr || null,
      gender_restriction: property.genderRestriction || null,
      created_at: property.createdAt
    });

    if (error) {
      console.warn('Supabase property sync warning:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase sync error:', err);
    return false;
  }
}

export async function syncTenantPassToSupabase(tenant: TenantUser, config: SupabaseConfig): Promise<boolean> {
  const client = getSupabaseClient(config);
  if (!client) return false;

  try {
    const { error } = await client.from('tenant_passes').upsert({
      id: tenant.id,
      name: tenant.name,
      whatsapp: tenant.whatsapp,
      preferred_city: tenant.preferredCity || null,
      tenant_type: tenant.tenantType || null,
      has_paid_pass: tenant.hasPaidPass,
      pass_utr: tenant.passUtr || null,
      pass_purchased_at: tenant.passPurchasedAt || new Date().toISOString()
    });

    if (error) {
      console.warn('Supabase tenant pass sync warning:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase tenant pass error:', err);
    return false;
  }
}

export async function syncAppointmentToSupabase(appointment: Appointment, config: SupabaseConfig): Promise<boolean> {
  const client = getSupabaseClient(config);
  if (!client) return false;

  try {
    const { error } = await client.from('appointments').insert({
      id: appointment.id,
      property_id: appointment.propertyId,
      property_title: appointment.propertyTitle,
      tenant_name: appointment.tenantName,
      tenant_whatsapp: appointment.tenantWhatsapp,
      visit_date: appointment.date,
      time_slot: appointment.timeSlot,
      notes: appointment.notes || null,
      status: appointment.status,
      created_at: appointment.createdAt
    });

    if (error) {
      console.warn('Supabase appointment sync warning:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase appointment error:', err);
    return false;
  }
}

export async function fetchRemoteProperties(config: SupabaseConfig): Promise<Property[] | null> {
  const client = getSupabaseClient(config);
  if (!client) return null;

  try {
    const { data, error } = await client.from('properties').select('*').order('created_at', { ascending: false });
    if (error || !data) return null;

    return data.map((row: any) => ({
      id: row.id,
      title: row.title,
      propertyType: row.property_type,
      sharingType: row.sharing_type,
      address: row.address,
      city: row.city,
      landmark: row.landmark,
      monthlyRent: Number(row.monthly_rent),
      securityDeposit: Number(row.security_deposit),
      ownerName: row.owner_name,
      ownerPhone: row.owner_phone,
      ownerWhatsapp: row.owner_whatsapp,
      images: row.images as [string, string, string, string],
      facilities: row.facilities || [],
      description: row.description || '',
      isVerified: Boolean(row.is_verified),
      listingUtr: row.listing_utr,
      genderRestriction: row.gender_restriction,
      createdAt: row.created_at
    }));
  } catch (err) {
    console.warn('Failed to fetch remote properties:', err);
    return null;
  }
}

export const SUPABASE_SQL_SCHEMA = `-- NestFinder Supabase Database Setup
-- Run this SQL in your Supabase Dashboard SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Properties Table (Hostels, PGs, Rental Houses)
CREATE TABLE IF NOT EXISTS public.properties (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    property_type TEXT NOT NULL,
    sharing_type TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    landmark TEXT,
    monthly_rent NUMERIC NOT NULL,
    security_deposit NUMERIC NOT NULL,
    owner_name TEXT NOT NULL,
    owner_phone TEXT NOT NULL,
    owner_whatsapp TEXT NOT NULL,
    images JSONB NOT NULL, -- Array of 4 image URLs
    facilities JSONB DEFAULT '[]'::jsonb,
    description TEXT,
    is_verified BOOLEAN DEFAULT true,
    listing_utr TEXT,
    gender_restriction TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tenant Passes Table (Students & Tenants with ₹99 pass)
CREATE TABLE IF NOT EXISTS public.tenant_passes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    preferred_city TEXT,
    tenant_type TEXT,
    has_paid_pass BOOLEAN DEFAULT false,
    pass_utr TEXT,
    pass_purchased_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Appointments & Visit Bookings
CREATE TABLE IF NOT EXISTS public.appointments (
    id TEXT PRIMARY KEY,
    property_id TEXT REFERENCES public.properties(id) ON DELETE CASCADE,
    property_title TEXT NOT NULL,
    tenant_name TEXT NOT NULL,
    tenant_whatsapp TEXT NOT NULL,
    visit_date TEXT NOT NULL,
    time_slot TEXT NOT NULL,
    notes TEXT,
    status TEXT DEFAULT 'Pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Payments Log (Tenant Passes & Owner Listing Fees)
CREATE TABLE IF NOT EXISTS public.payments (
    id TEXT PRIMARY KEY,
    user_type TEXT NOT NULL, -- 'tenant' or 'owner'
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    amount NUMERIC DEFAULT 99,
    utr TEXT NOT NULL,
    reference_id TEXT NOT NULL,
    property_id TEXT,
    status TEXT DEFAULT 'verified',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) and grant public read/write access for easy setup
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_passes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to properties" ON public.properties FOR SELECT USING (true);
CREATE POLICY "Allow public insert to properties" ON public.properties FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update to properties" ON public.properties FOR UPDATE USING (true);

CREATE POLICY "Allow public all access to tenant_passes" ON public.tenant_passes FOR ALL USING (true);
CREATE POLICY "Allow public all access to appointments" ON public.appointments FOR ALL USING (true);
CREATE POLICY "Allow public all access to payments" ON public.payments FOR ALL USING (true);
`;
