declare module 'react-stars' {
    import * as React from 'react';
  
    interface ReactStarsProps {
      count: number;
      onChange: (rating: number) => void;
      size: number;
      color2: string;
      half: boolean;
      edit: boolean;
    }
  
    const ReactStars: React.FC<ReactStarsProps>;
    export default ReactStars;
  }
  