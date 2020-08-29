import React from "react";
import styled from "styled-components";

const Post = ({ children, date }) => {
  return (
    <StyledPost>
      <h4 className="date">{date}</h4>
      {children}
    </StyledPost>
  );
};

function App() {
  return (
    <Container>
      <Meta>
        <div>Stephen Chung</div>
        <div>
          <Link href="https://www.github.com/imsteev">Github</Link>
          &nbsp;
          <Link href="https://www.linkedin.com/in/imsteev/">LinkedIn</Link>
        </div>
      </Meta>
      <Header>Interpret however you like</Header>
      <Post date="August 9th 2020">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer tempus
        viverra orci sed facilisis. Proin fringilla quis tellus eget interdum.
        Ut a suscipit nibh, in dictum lorem. Ut pellentesque ex rhoncus nibh
        mollis ultrices. Donec pulvinar, neque vel pharetra vehicula, mauris
        arcu eleifend dui, ac imperdiet ipsum arcu quis sem. Phasellus
        sollicitudin lobortis erat. Nunc nibh lorem, luctus non tortor quis,
        posuere porta ipsum. Vestibulum vehicula metus vel lectus posuere, id
        consectetur ipsum auctor.
      </Post>
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
  font-family: sans serif;
  padding: 0 25vw;
  padding-top: 2rem;
  grid-template-rows: 3rem 5rem;
`;
const Header = styled.h2`
  font-variant: all-small-caps;
`;

const StyledPost = styled.div`
  .date {
    justify-self: start;
  }
`;

const Meta = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Link = styled.a`
  color: black;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

export default App;
