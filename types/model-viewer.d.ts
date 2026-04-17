// Type shim for the @google/model-viewer custom element loaded via CDN.
// Keeps the JSX intrinsic signature loose enough for the attributes we use
// while still catching obvious typos on the ones we surface explicitly.

import type * as React from 'react';

type ModelViewerAttributes = React.HTMLAttributes<HTMLElement> & {
  src?: string;
  alt?: string;
  'camera-controls'?: boolean;
  'disable-zoom'?: boolean;
  'interaction-prompt'?: string;
  'touch-action'?: string;
  'camera-orbit'?: string;
  'min-camera-orbit'?: string;
  'max-camera-orbit'?: string;
  'field-of-view'?: string;
  'shadow-intensity'?: string;
  'shadow-softness'?: string;
  'environment-image'?: string;
  exposure?: string;
};

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<ModelViewerAttributes, HTMLElement>;
    }
  }

  interface HTMLElementTagNameMap {
    'model-viewer': HTMLElement & {
      cameraOrbit?: string;
    };
  }
}

export {};
