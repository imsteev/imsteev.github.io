import React from "react";
import styled from "styled-components";

const Post = ({ children, date }) => {
  return (
    <StyledPost>
      <p className="date">{date}</p>
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
      <Header>Year 2020</Header>
      <Post date="May 31">
        <p>
          Reflecting on my upbringing, I grew up in a sheltered, educated, and
          diverse neighborhood. For this reason, I don't feel entitled to the
          conviction that the world is feeling. But I am hurt. I am angry, I am
          confused, I am baffled, I am tired.
        </p>

        <p>
          Every word that comes out of Trump's mouth fans the social flames of
          today. So many blind eyes to basic common sense make inequality a
          reality.
        </p>

        <p>
          What this all boils down to: <strong>mindless</strong>,{" "}
          <strong>racist</strong>, and <strong>ignorant bigots</strong> in
          power.
        </p>

        <ul>
          <li>What will push the country for tangible change?</li>
          <li>How can we trust leaders of this country?</li>
          <li>How many "accidental" martyrs will there be?</li>
          <li>
            How can someone watch these events of police brutality events
            happening and say "this is just an accident"?
          </li>
          <li>How can we redefine justice?</li>
          <li>
            <strong>
              Why would a cop put a knee on someone's neck for 8 minutes and 46
              seconds?
            </strong>
          </li>
        </ul>

        <p>
          I urge everyone to reflect and ask themselves these questions, and I
          hope you feel as troubled as I do.
        </p>

        <Afterthought>FTP F12 BLM</Afterthought>
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
  padding: 0 25vw;
  padding-top: 2rem;
  grid-template-rows: 3rem;
  grid-auto-rows: min-content;
`;
const Header = styled.h2`
  font-variant: all-small-caps;
`;

const StyledPost = styled.div`
  .date {
    font-size: 1.2rem;
    justify-self: start;
    font-variant: all-small-caps;
  }
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

const Afterthought = styled.p`
  font-style: italic;
`;

export default App;
