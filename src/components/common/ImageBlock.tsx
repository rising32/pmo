import React from 'react';
interface ImageProps extends React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
  placeholderImg?: string;
  errorImg?: string;
}
const ImageBlock = ({ placeholderImg, errorImg, src, ...props }: ImageProps) => {
  const [imgSrc, setSrc] = React.useState(placeholderImg || src);

  const onLoad = React.useCallback(() => {
    setSrc(src);
  }, [src]);

  const onError = React.useCallback(() => {
    setSrc(errorImg || placeholderImg);
  }, [errorImg, placeholderImg]);

  React.useEffect(() => {
    const img = new Image();
    if (src) {
      img.src = src;
      img.addEventListener('load', onLoad);
      img.addEventListener('error', onError);
    }

    return () => {
      img.removeEventListener('load', onLoad);
      img.removeEventListener('error', onError);
    };
  }, [src, onLoad, onError]);

  return <img {...props} alt={imgSrc} src={imgSrc} />;
};

export default ImageBlock;
