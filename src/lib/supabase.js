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
 * Converts a File object to a Base64 data URL (useful for demo mode without Supabase credentials)
 * @param {File} file 
 * @returns {Promise<string>}
 */
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * Uploads an image file to Supabase Storage and returns its public URL.
 * Falls back to local Data URL in Demo mode if Supabase is unconfigured.
 * @param {File} file - File object to upload
 * @param {string} bucket - Supabase Storage bucket name (default 'projects')
 * @returns {Promise<string>} Public URL of the uploaded image
 */
export async function uploadProjectImage(file, bucket = 'projects') {
  if (!isSupabaseConfigured) {
    console.warn('[Supabase Storage] Not configured. Generating local Data URL preview.')
    return await fileToDataUrl(file)
  }

  const rawExt = file.name.split('.').pop() || 'jpg'
  const fileExt = rawExt.toLowerCase().replace(/[^a-z0-9]/g, '')
  const randomId = Math.random().toString(36).substring(2, 9)
  const fileName = `${Date.now()}-${randomId}.${fileExt}`
  const filePath = `uploads/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, { 
      cacheControl: '3600', 
      upsert: false,
      contentType: file.type || `image/${fileExt}`
    })

  if (uploadError) {
    console.error(`[Supabase Storage] Upload error to bucket "${bucket}":`, uploadError)
    throw uploadError
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)
  return data.publicUrl
}

/**
 * Uploads multiple image files to Supabase Storage in parallel and returns array of public URLs
 * @param {FileList | File[]} files - Array or FileList of files to upload
 * @param {string} bucket - Supabase Storage bucket name (default 'projects')
 * @param {function(number, number): void} [onProgress] - Optional callback (completedCount, totalCount)
 * @returns {Promise<string[]>} Array of uploaded public URLs
 */
export async function uploadMultipleProjectImages(files, bucket = 'projects', onProgress) {
  const fileList = Array.from(files)
  if (fileList.length === 0) return []

  let completed = 0
  const total = fileList.length

  const uploadPromises = fileList.map(async (file) => {
    try {
      const url = await uploadProjectImage(file, bucket)
      completed += 1
      if (typeof onProgress === 'function') {
        onProgress(completed, total)
      }
      return url
    } catch (err) {
      console.error(`Failed to upload ${file.name}:`, err)
      throw err
    }
  })

  return await Promise.all(uploadPromises)
}

export default supabase
