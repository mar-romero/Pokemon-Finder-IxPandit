import { forwardRef } from 'react';

const Image = forwardRef(({ src, alt, ...props }: any, ref: any) => (
  <img 
    ref={ref}
    src={src} 
    alt={alt} 
    {...props}
    data-testid="next-image"
  />
));

Image.displayName = 'NextImageMock';

export default Image; 