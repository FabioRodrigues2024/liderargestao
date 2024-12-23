import { supabase } from './supabase';

export const emailService = {
  async sendApprovalEmail(to: string, companyName: string) {
    const { error } = await supabase.functions.invoke('send-approval-email', {
      body: {
        to,
        companyName
      }
    });

    if (error) throw error;
  },

  async sendRejectionEmail(to: string, companyName: string, reason?: string) {
    const { error } = await supabase.functions.invoke('send-rejection-email', {
      body: {
        to,
        companyName,
        reason
      }
    });

    if (error) throw error;
  }
};