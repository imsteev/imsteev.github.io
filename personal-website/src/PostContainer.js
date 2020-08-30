import React, { useEffect, useState } from "react";
import styled, { css, keyframes } from "styled-components";

/**
 * A single post
 * Date and title are optional, but recommended
 */
const Post = ({ children, date, title, enclosedTitle = false }) => {
  return (
    <StyledPost>
      <p className="header">
        {date} {title && enclosedTitle ? `"${title}"` : title}
      </p>
      {children}
    </StyledPost>
  );
};

/**
 * All of this is static content
 * Posts are displayed in reverse-chronological order
 */
const PostContainer = () => (
  <StyledPostContainer>
    <Post title="Shiba Generator" date="August 31" enclosedTitle>
      <RandomDog breed="shiba" />
    </Post>
    <Post title="CSS Practice" date="August 30" enclosedTitle>
      <CssPractice1 />
    </Post>
    <Post date="August 29" title="v2" enclosedTitle>
      <p>
        I previously implemented my personal website using Vue.js, but it
        quickly became hard to maintain without a proper component structure. So
        I rewrote this site with React since I'm more familiar with it now than
        I am with Vue.js.
      </p>
      <p>
        Hopefully the ease of modifying content will encourage me to write more
        often.
      </p>
    </Post>
    <Post date="May 31" title="Unrest" enclosedTitle>
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
        <strong>racist</strong>, and <strong>ignorant bigots</strong> in power.
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
  </StyledPostContainer>
);

const RandomDog = ({ breed }) => {
  const [randomDogUrl, setRandomDogUrl] = useState("");

  const randomDogRefresh = () => {
    fetch(`https://dog.ceo/api/breed/${breed}/images/random`, {})
      .then((resp) => {
        if (!resp.ok) {
          throw "Request failed";
        }
        return resp.json();
      })
      .then((jsonResp) => setRandomDogUrl(jsonResp.message))
      .catch(console.log);
  };
  useEffect(() => {
    randomDogRefresh();
  }, []);

  return (
    <div>
      {randomDogUrl && (
        <>
          <Button onClick={randomDogRefresh}>another {breed}</Button>

          <Flex>
            <figure style={{ padding: 0, margin: "1rem 0" }}>
              {randomDogUrl && <img alt="random-shiba" src={randomDogUrl} />}
            </figure>
          </Flex>
        </>
      )}
    </div>
  );
};

const Button = styled.button`
  border: none;
  cursor: pointer;
  padding: 0 1.4rem;
  height: 3rem;
  transition: box-shadow 0.2s linear;
  box-shadow: 3px 2px 4px 0 rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  background-color: #004e89;
  color: #f0efeb;
  transition: all 0.3s;
  :hover {
    opacity: 0.8;
  }
  :active {
    box-shadow: none;
  }
  :focus {
    outline: none;
  }
`;

const StyledPostContainer = styled.div`
  display: grid;
`;

const StyledPost = styled.div`
  border-bottom: solid 1px grey;
  line-height: 24px;
  .header {
    font-size: 1.5rem;
    justify-self: start;
    font-variant: all-small-caps;
  }
`;

const Afterthought = styled.p`
  font-size: 0.8rem;
  font-style: italic;
`;

const Pace = keyframes`
  0% {
    transform: translateX(0);
  }

  25% {
    transform: translateX(6rem);
  }

  50% {
    transform: translateX(12rem);
  }
  75% {
    transform: translateX(6rem);
  }
  100% {
    transform: translateX(0);
  }
`;

const Rotate = keyframes`
  to {
    transform: rotate(359deg);
  }
`;

const CssPractice1 = () => {
  const [playing, setPlaying] = useState(false);
  return (
    <StyledCssPractice1 animate={playing}>
      <div>
        <Button onClick={() => setPlaying(!playing)}>
          {playing ? "pause animations" : "play animations"}
        </Button>
        <Flex>
          <>
            <p>Look it's a rotating square</p>
            <Animation className="box" id="animation-1" />
          </>
          <>
            <p>This one's a mover</p>
            <Animation className="box" id="animation-2" />
          </>
        </Flex>
      </div>
    </StyledCssPractice1>
  );
};

const Animation = ({ animate, id, className }) => {
  return <StyledAnimation animate={animate} className={className} id={id} />;
};

const StyledAnimation = styled.div``;
const StyledCssPractice1 = styled.div`
  .box {
    width: 24px;
    height: 24px;
  }

  #animation-1 {
    background-color: blue;

    ${({ animate }) =>
      animate &&
      css`
        animation: ${Rotate} 4s linear infinite;
      `}
    margin: 1rem;
    transition: background-color 0.4s;

    :hover {
      background-color: #fea423;
    }
  }

  #animation-2 {
    background-color: seagreen;
    ${({ animate }) =>
      animate &&
      css`
        animation: ${Pace} 1s linear infinite;
      `}
    margin: 1rem;
  }
`;

const Flex = styled.div`
  display: flex;
  align-content: center;
`;

const Grid = styled.div`
  display: grid;
`;

export default PostContainer;
