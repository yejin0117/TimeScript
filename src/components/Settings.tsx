import styled from "styled-components";

const Container = styled.div`
  color: blue;
  font-size: 20px;
`;

const Title = styled.h1`
`;

const Desc = styled.p`
`;

const Settings = ()=>{
  return<Container>
    <Title>Settings</Title>
    <Desc>This is a Settings Screen.</Desc>
    </Container>
}

export default Settings;