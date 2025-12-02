import type React from 'react';

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface GroundingChunk {
  web?: {
    // FIX: Made uri and title optional to match SDK type
    uri?: string;
    title?: string;
  };
  maps?: {
    // FIX: Made uri and title optional to match SDK type
    uri?: string;
    title?: string;
    // FIX: Changed placeAnswerSources to be an object instead of an array of objects to match the SDK type.
    placeAnswerSources?: {
        // FIX: Corrected the type for reviewSnippets. It is an array of objects with text and uri, not nested in a `snippet` object.
        reviewSnippets: {
            text?: string;
            uri?: string;
        }[];
    };
  };
}
