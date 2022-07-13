import { acceptHMRUpdate, defineStore } from 'pinia';

export type AlertStyle = 'error' | 'success' | 'warning' | 'info' | 'none';

export interface AlertOptions {
  html?: boolean;
  closable?: boolean;
  timeout?: number;
  style?: AlertStyle;
}

export interface Alert extends AlertOptions {
  id: string;
  message: string;
}

const defaultOptions: Required<AlertOptions> = {
  closable: true,
  html: false,
  timeout: 3000,
  style: 'info',
};

export const useAlerts = defineStore('alerts', {
  state: () => ({
    items: [] as Alert[],
  }),
  actions: {
    notify(message: string, style: AlertStyle, options?: AlertOptions) {
      options = { ...defaultOptions, ...options };

      const id = new Date().toString();
      this.items.push({
        id,
        message,
        ...options,
        style,
      });

      if (options.timeout) {
        setTimeout(() => {
          this.remove(id);
        }, options.timeout);
      }
    },

    remove(id: string) {
      const idx = this.items.findIndex((i) => i.id === id);
      if (idx >= 0) {
        this.items.splice(idx, 1);
      }
    },

    success(message: string, options?: AlertOptions) {
      this.notify(message, 'success', options);
    },

    error(message: string, options?: AlertOptions) {
      this.notify(message, 'error', options);
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAlerts, import.meta.hot));
}
