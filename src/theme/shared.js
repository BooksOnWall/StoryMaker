import styled, { css } from 'styled-components';

export const Button = styled.button`
  padding: 0.5rem 1rem;
  margin: 0.5rem 1rem;
  color: ${({ theme }) => theme.primary};
  font-size: 1rem;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  border: 2px solid ${props => props.border};
  background-color: Transparent;
  text-transform: uppercase;
  border-radius: 4px;
  transition: all 0.1s;
  &:hover {
    transform: translateY(1px);
    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.15);
  }
  ${props =>
    props.primary &&
    css`
      background: ${({ theme }) => theme.primary};
      border: 2px solid ${({ theme }) => theme.primary};
      color: white;
  `};
  ${props =>
    props.danger &&
    css`
      background: ${({ theme }) => theme.danger};
      border: 2px solid ${({ theme }) => theme.danger};
      color: white;
  `};
  &:hover {
    transform: translateY(1px);
    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.15);
  }
`;

export const StyledHyperLink = styled.a`
  cursor: pointer;
  &:visited,
  &:active {
    color: ${({ theme }) => theme.primary};
  }
  &:hover {
    color: ${({ theme }) => theme.secondary};
  }
  color: ${({ theme }) => theme.primary};
`;
