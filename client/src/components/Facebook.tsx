import React, { useEffect } from "react";
import { SHA256 } from "crypto-js";

declare global {
  interface Window {
    fbq: Function & {
      callMethod?: Function;
      queue?: any[];
      loaded?: boolean;
      version?: string;
      push?: Function;
    };
    _fbq: Window['fbq'];
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

// Initialize Facebook Pixel
const initializeFacebookPixel = () => {
  const f = window;
  f.fbq = function(...args: any[]) {
    if (f.fbq.callMethod) {
      f.fbq.callMethod.apply(f.fbq, args);
    } else {
      f.fbq.queue.push(args);
    }
  };

  if (!f._fbq) f._fbq = f.fbq;
  f.fbq.push = f.fbq;
  f.fbq.loaded = true;
  f.fbq.version = '2.0';
  f.fbq.queue = [];

  const t = document.createElement('script');
  t.async = true;
  t.src = 'https://connect.facebook.net/en_US/fbevents.js';
  const s = document.getElementsByTagName('script')[0];
  s.parentNode?.insertBefore(t, s);
  console.log("Facebook Pixel script adicionado.");
};

const Facebook: React.FC<FacebookProps> = ({ event, params }) => {
  useEffect(() => {
    // Initialize Facebook Pixel
    if (typeof window !== 'undefined' && !window.fbq) {
      console.log("Inicializando Facebook Pixel...");
      initializeFacebookPixel();
      const pixelId = import.meta.env.VITE_FACEBOOK_PIXEL_ID || "";
      console.log("Pixel ID: ", pixelId);
      window.fbq("init", pixelId);
      window.fbq("track", "PageView");
      console.log("Evento PageView enviado.");
    }

    if (event && window.fbq) {
      // Prepare tracking parameters
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

        // Add hashed user data parameters
        Object.assign(trackingParams, {
          external_id: email ? hashData(email) : undefined,
          em: email ? hashData(email) : undefined,
          ph: phone ? hashData(phone.replace(/\D/g, '')) : undefined,
          fn: name ? hashData(name.split(' ')[0]) : undefined,
          ln: name ? hashData(name.split(' ').slice(1).join(' ')) : undefined,
          client_user_agent: navigator.userAgent,
        });
      }

      // Remove undefined values
      const cleanParams = Object.fromEntries(
        Object.entries(trackingParams).filter(([_, v]) => v !== undefined)
      );

      console.log("Enviando evento:", event, "com parâmetros:", cleanParams);
      window.fbq("track", event, cleanParams);
    }
  }, [event, params]);

  return null;
};

export default Facebook;