import React, {ChangeEventHandler} from 'react';
import {Box} from '../../common/Box';
import {css} from '@emotion/react';
import {SearchIcon} from '../../../icons/SearchIcon';

type Props = {
  onSearchValueChanged: ChangeEventHandler<HTMLInputElement>;
};
export const Search: React.FC<Props> = ({onSearchValueChanged}) => {
  return (
    <Box
      style={css`
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding: 16px;
        column-gap: 16px;
        border-radius: 24px;
      `}>
      <SearchIcon />
      <input
        type="text"
        placeholder="Search..."
        onChange={onSearchValueChanged}
        css={css`
          border: none;
          font-size: 1.125rem;
          background: none;
          &:focus {
            outline: none;
          }
        `}
      />
    </Box>
  );
};
