interface EnvConfig {
  netlify: {
    siteId: string;
    webhookUrl: string;
  };
  supabase: {
    url: string;
    anonKey: string;
  };
}

export const env: EnvConfig = {
  netlify: {
    siteId: import.meta.env.VITE_NETLIFY_SITE_ID,
    webhookUrl: `https://api.netlify.com/build_hooks/${import.meta.env.VITE_NETLIFY_SITE_ID}`
  },
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY
  }
};