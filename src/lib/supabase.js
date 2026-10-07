import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project.supabase.co' && 
  !supabaseUrl.includes('placeholder')
)

// Fallback mock client to prevent crash if env variables are not yet set
const mockClient = {
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signInWithPassword: async () => ({ 
      data: null, 
      error: new Error('Supabase credentials not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.') 
    }),
    signOut: async () => ({ error: null }),
    getUser: async () => ({ data: { user: null }, error: null })
  },
  from: () => ({
    select: () => ({
      order: () => Promise.resolve({ data: [], error: null }),
      eq: () => ({
        single: () => Promise.resolve({ data: null, error: null }),
        order: () => Promise.resolve({ data: [], error: null }),
        then: (cb) => Promise.resolve({ data: [], error: null }).then(cb)
      }),
      single: () => Promise.resolve({ data: null, error: null }),
      then: (cb) => Promise.resolve({ data: [], error: null }).then(cb)
    }),
    insert: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
    update: () => ({ eq: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }) }),
    delete: () => ({ eq: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }) })
  }),
  storage: {
    from: () => ({
      upload: () => Promise.resolve({ data: null, error: new Error('Supabase Storage not configured') }),
      getPublicUrl: () => ({ data: { publicUrl: '' } })
    })
  }
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : mockClient

/**
 * Uploads an image file to Supabase Storage and returns its public URL
 * @param {File} file - File object to upload
 * @param {string} bucket - Supabase Storage bucket name (default 'projects')
 * @returns {Promise<string>} Public URL of the uploaded image
 */
export async function uploadProjectImage(file, bucket = 'projects') {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured')
  }

  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`
  const filePath = `uploads/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, { cacheControl: '3600', upsert: false })

  if (uploadError) throw uploadError

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)
  return data.publicUrl
}

export default supabase
