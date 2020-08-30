import React from "react";
import styled from "styled-components";

/**
 * A single post
 * Date and title are optional, but recommended
 */
const Post = ({ children, date, title }) => {
  return (
    <StyledPost>
      <p className="header">
        {date} {title && `"${title}"`}
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
    <Post date="August 29" title="">
      Hello
    </Post>
    <Post date="May 31" title="Unrest">
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

const StyledPostContainer = styled.div`
  display: grid;
  grid-row-gap: 1rem;
`;

const StyledPost = styled.div`
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

export default PostContainer;
