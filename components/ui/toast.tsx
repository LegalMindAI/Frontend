"use client"

import * as React from "react"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }

export const toast = (props: { title?: string; description?: string; variant?: "default" | "destructive" }) => {
  // We need to dynamically import sonner because it's a client component
  // and we might use toast from server components
  import("sonner").then((module) => {
    const { toast } = module
    if (props.variant === "destructive") {
      toast.error(props.title, {
        description: props.description,
      })
    } else {
      toast.success(props.title, {
        description: props.description,
      })
    }
  })
} 