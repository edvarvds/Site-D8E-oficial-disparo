import React, { useEffect } from "react";
import { SHA256 } from "crypto-js";

declare global {
  interface Window {
    fbq: any;
    _fbq: any;
  }
}

interface FacebookProps {
  event?: string;
  params?: {
    content_name?: string;
    content_category?: string;
    content_ids?: string[];
    content_type?: string;
    value?: number;
    currency?: string;
    num_items?: number;
    transaction_id?: string;
    user_data?: {
      email?: string;
      phone?: string;
      name?: string;
    };
  };
}

// Function to hash sensitive data
const hashData = (data: string): string => {
  return SHA256(data.toLowerCase().trim()).toString();
};

const Facebook: React.FC<FacebookProps> = ({ event, params }) => {
  useEffect(() => {
    // Garantir que estamos no navegador
    if (typeof window === 'undefined') return;

    try {
      // Track custom event if provided
      if (event && window.fbq) {
        const trackingParams = {
          ...params,
          value: typeof params?.value === 'number' ? params.value : undefined,
          currency: params?.currency || 'BRL',
          content_type: params?.content_type || 'product',
          content_ids: Array.isArray(params?.content_ids) ? params.content_ids : undefined,
          transaction_id: params?.transaction_id
        };

        // Add user data if provided
        if (params?.user_data) {
          const { email, phone, name } = params.user_data;
          Object.assign(trackingParams, {
            external_id: email ? hashData(email) : undefined,
            em: email ? hashData(email) : undefined,
            ph: phone ? hashData(phone.replace(/\D/g, '')) : undefined,
            fn: name ? hashData(name.split(' ')[0]) : undefined,
            ln: name ? hashData(name.split(' ').slice(1).join(' ')) : undefined
          });
        }

        // Remove undefined values
        const cleanParams = Object.fromEntries(
          Object.entries(trackingParams).filter(([_, v]) => v !== undefined)
        );

        console.log(`Enviando evento "${event}"`, cleanParams);
        window.fbq("track", event, cleanParams);
      }
    } catch (error) {
      console.error("Erro ao executar Facebook Pixel:", error);
    }
  }, [event, params]);

  return null;
};

export default Facebook;