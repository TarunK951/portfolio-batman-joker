'use client';

import { useTheme } from '@/components/theme/ThemeProvider';
import { BatmanStatLab } from '@/components/sections/BatmanStatLab';

/**
 * DCGrid — delegates entirely to BatmanStatLab under the batman theme.
 * Other themes (ancient-india) opt out and render nothing; they have
 * their own parallel section(s).
 */
export function DCGrid() {
  const { theme } = useTheme();
  if (theme !== 'batman') return null;
  return <BatmanStatLab />;
}

export default DCGrid;
