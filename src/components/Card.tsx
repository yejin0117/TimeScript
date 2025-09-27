import React from "react";
import styled from "styled-components";

interface CardProps {
  icon: string;
  title: string;
  description: string;
  buttonText: string;
  color: string;
  onClick: () => void;
}

const CardContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(4px);
  border-radius: 16px;
  padding: 32px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  }
`;

const Icon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`;

const Title = styled.h3`
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 12px;
`;

const Description = styled.p`
  font-size: 16px;
  color: #666;
  margin-bottom: 20px;
`;

const Button = styled.div<{ color: string }>`
  background: ${({ color }) => color};
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: background 0.3s ease;
  display: inline-block;

  &:hover {
    filter: brightness(0.9);
  }
`;

const Card: React.FC<CardProps> = ({
  icon,
  title,
  description,
  buttonText,
  color,
  onClick,
}) => {
  return (
    <CardContainer onClick={onClick}>
      <Icon>{icon}</Icon>
      <Title>{title}</Title>
      <Description>{description}</Description>
      <Button color={color}>{buttonText}</Button>
    </CardContainer>
  );
};

export default Card;
