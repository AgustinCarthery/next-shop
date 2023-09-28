import { ISize } from '@/interfaces';
import { Box, Button } from '@mui/material';
import { FC } from 'react';

interface Props {
  selectedSize?: ISize;
  sizes: ISize[];
  onSizeSelect: (size: ISize) => void;
}
export const SizeSelector: FC<Props> = ({
  selectedSize,
  sizes,
  onSizeSelect,
}) => {
  const handleSizeSelect = (size: ISize) => {
    onSizeSelect(size);
  };
  return (
    <Box>
      {sizes.map((size) => (
        <Button
          key={size}
          size='small'
          color={selectedSize === size ? 'primary' : 'info'}
          onClick={() => handleSizeSelect(size)}
        >
          {size}
        </Button>
      ))}
    </Box>
  );
};
