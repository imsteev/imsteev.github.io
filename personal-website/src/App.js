import React from "react";
import styled from "styled-components";
import PostContainer from "./PostContainer";

function App() {
  return (
    <Container>
      <Meta>
        <div>Stephen Chung</div>
        <div>
          <Link href="https://www.github.com/imsteev" target="_blank">
            github
          </Link>
          &nbsp;
          <Link href="https://www.linkedin.com/in/imsteev/" target="_blank">
            linkedin
          </Link>
        </div>
      </Meta>
      <PostContainer />
    </Container>
  );
}

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: grid;
  padding: 0 25vw;
  padding-top: 2rem;
  grid-template-rows: 3rem;
  grid-auto-rows: min-content;
`;

const Meta = styled.div`
  display: flex;
  justify-content: space-between;
  align-self: center;
  padding-right: 2rem;
  font-size: 0.9rem;
`;

const Link = styled.a`
  color: #3454d1;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

export default App;
