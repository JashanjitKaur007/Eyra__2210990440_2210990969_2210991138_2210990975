// This is a utility function that combines the clsx and tailwind-merge libraries to create a single function for merging class names. The clsx library is used to conditionally combine class names, while the tailwind-merge library is used to merge Tailwind CSS class names and resolve conflicts. This function can be used throughout the application to simplify the process of managing class names in React components.

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"


// The cn function takes any number of class name inputs, merges them using clsx to handle conditional class names, and then uses twMerge to resolve any conflicts between Tailwind CSS classes. This allows for a clean and efficient way to manage class names in the application, especially when using Tailwind CSS for styling.
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
