"use client";

import React from "react";
import { X } from "lucide-react";
import { cn } from "~/utils/utils";
import Image from "next/image";
import { createContext, useContext, useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";

// Types
export type AlertVariant =
  | "information"
  | "success"
  | "caution"
  | "error"
  | "ai";

export interface AlertAction {
  primary?: {
    label: string;
    onClick: () => void;
  };
  secondary?: {
    label: string;
    onClick: () => void;
  };
}

export interface AlertProps {
  variant?: AlertVariant;
  title: string;
  message?: string;
  onClose?: () => void;
  className?: string;
  actions?: AlertAction;
  dismissible?: boolean;
  duration?: number;
  position?: "top-right" | "bottom-right";
}

interface Toast extends AlertProps {
  id: string;
  isLeaving?: boolean;
}

// Context
interface AlertContextType {
  toasts: Toast[];
  showToast: (alert: AlertProps) => void;
  removeToast: (id: string) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

// Styles and Icons Configuration
const variantStyles = {
  information: "bg-blue-50 text-blue-800 border border-blue-200",
  success: "bg-green-50 text-green-800 border border-green-200",
  caution: "bg-yellow-50 text-yellow-800 border border-yellow-200",
  error: "bg-red-50 text-red-800 border border-red-200",
  ai: "bg-purple-50 text-purple-800 border border-purple-200",
};

const iconMap = {
  information: (
    <Image
      src="/icons/alert/info-fill.svg"
      alt="Information"
      width={16}
      height={16}
      className="text-blue-600"
    />
  ),
  success: (
    <Image
      src="/icons/alert/check-circle.svg"
      alt="Success"
      width={16}
      height={16}
      className="text-green-600"
    />
  ),
  caution: (
    <Image
      src="/icons/alert/warning-triangle.svg"
      alt="Caution"
      width={16}
      height={16}
      className="text-yellow-600"
    />
  ),
  error: (
    <Image
      src="/icons/alert/warning-circle.svg"
      alt="Error"
      width={16}
      height={16}
      className="text-red-600"
    />
  ),
  ai: (
    <Image
      src="/icons/alert/spark.svg"
      alt="AI"
      width={16}
      height={16}
      className="text-purple-600"
    />
  ),
};

// Base Alert Component
export const XWAlert = ({
  variant = "information",
  title,
  message,
  onClose,
  className,
  actions,
  dismissible = true,
}: AlertProps) => {
  return (
    <div
      className={cn(
        "relative rounded-lg p-4 shadow-sm",
        variantStyles[variant],
        className,
      )}
    >
      <div className="z-[99999] flex items-start gap-3">
        <div className="mt-0.5 flex-shrink-0">{iconMap[variant]}</div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold">{title}</h3>
          {message && <p className="mt-1 text-sm opacity-90">{message}</p>}
          {actions && (
            <div className="mt-3 flex gap-3">
              {actions.primary && (
                <button
                  onClick={actions.primary.onClick}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-sm font-medium",
                    variant === "information" &&
                      "bg-blue-100 text-blue-700 hover:bg-blue-200",
                    variant === "success" &&
                      "bg-green-100 text-green-700 hover:bg-green-200",
                    variant === "caution" &&
                      "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
                    variant === "error" &&
                      "bg-red-100 text-red-700 hover:bg-red-200",
                    variant === "ai" &&
                      "bg-purple-100 text-purple-700 hover:bg-purple-200",
                  )}
                >
                  {actions.primary.label}
                </button>
              )}
              {actions.secondary && (
                <button
                  onClick={actions.secondary.onClick}
                  className="text-sm underline opacity-90 hover:opacity-100"
                >
                  {actions.secondary.label}
                </button>
              )}
            </div>
          )}
        </div>
        {dismissible && onClose && (
          <button
            onClick={onClose}
            className="opacity-70 transition-opacity hover:opacity-100"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

// Toast Container Component
export const XWAlertContainer = () => {
  const { toasts, removeToast } = useXWAlert();

  return (
    <div
      className={cn(
        "fixed z-[99999] flex flex-col gap-3",
        "bottom-6 mx-4",
        "tb:right-6",
        "tb:w-[420px] w-full",
        "tb:items-end items-center",
      )}
    >
      {toasts.slice(0, 1).map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "w-full max-w-[420px]",
            "transform transition-all duration-200 ease-in-out",
            toast.isLeaving
              ? "translate-x-full opacity-0"
              : "translate-x-0 opacity-100",
            "duration-200 animate-in slide-in-from-right-full",
          )}
        >
          <XWAlert
            {...toast}
            onClose={() => removeToast(toast.id)}
            className="shadow-lg"
          />
        </div>
      ))}
    </div>
  );
};

// Provider Component
export const XWAlertProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) =>
      prev.map((toast) =>
        toast.id === id ? { ...toast, isLeaving: true } : toast,
      ),
    );

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 300);
  }, []);

  const showToast = useCallback(
    (alert: AlertProps) => {
      if (!alert.title) {
        console.error("Toast title is required");
        return;
      }

      const id = uuidv4();
      const newToast = { ...alert, id };
      setToasts((prev) => [...prev, newToast]);

      if (alert.duration !== 0) {
        setTimeout(() => {
          setToasts((prev) =>
            prev.map((toast) =>
              toast.id === id ? { ...toast, isLeaving: true } : toast,
            ),
          );

          setTimeout(() => {
            removeToast(id);
          }, 300);
        }, alert.duration || 5000);
      }
    },
    [removeToast],
  );

  return (
    <AlertContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
    </AlertContext.Provider>
  );
};

// Custom Hook
export const useXWAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useXWAlert must be used within a XWAlertProvider");
  }
  return context;
};
