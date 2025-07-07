"use client"

import * as React from "react"
import { useCallback } from 'react';
import { useToast as useToastContext } from '../contexts/ToastContext';

type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  message: string;
  type?: ToastType;
  duration?: number;
}

export function useToast() {
  const { addToast } = useToastContext();

  const toast = useCallback(
    ({ message, type = 'info', duration = 5000 }: Toast) => {
      addToast({ message, type, duration });
    },
    [addToast]
  );

  return { toast };
}

export type { ToastType };
