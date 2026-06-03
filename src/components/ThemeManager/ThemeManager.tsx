'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

// 5 different shades of blue for the 5 pages
const themes = [
  'linear-gradient(to bottom right, #FCFBF7, #FCFBF7)', // Homepage (Pure Cream)
  'linear-gradient(to bottom right, #FCFBF7, #F2EDE4)', // Vertical 1 (Soft Beige tint)
  'linear-gradient(to bottom right, #FCFBF7, #F0F4F1)', // Vertical 2 (Soft Mint/Green tint)
  'linear-gradient(to bottom right, #FCFBF7, #FDF7ED)', // Vertical 3 (Soft Golden tint)
  'linear-gradient(to bottom right, #FCFBF7, #F5F5F0)'  // Vertical 4 (Soft Gray/Earth tint)
];

export default function ThemeManager({ verticals }: { verticals: any[] }) {
  const pathname = usePathname();

  useEffect(() => {
    let background = themes[0];

    // Determine if it's a vertical page
    if (pathname !== '/' && pathname.startsWith('/')) {
      const slug = pathname.replace('/', '');
      const index = verticals.findIndex(v => v.id === slug);
      
      // If found in verticals, assign its specific shade (index 0 gets theme 1, etc.)
      if (index !== -1 && index < 4) {
        background = themes[index + 1];
      }
    }

    // Apply the gradient to the body
    document.body.style.backgroundImage = background;
  }, [pathname, verticals]);

  return null;
}
