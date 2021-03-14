<script>
  import RandomDog from "./postContent/RandomDog.svelte";
  import CssPractice1 from "./postContent/CssPractice1.svelte";
  import Post from "./Post.svelte";
</script>

<div>
  <Post title="Shiba Generator" date="August 31" enclosedTitle>
    <RandomDog breed="shiba" />
  </Post>
  <Post title="CSS Practice" date="August 30, 2020" enclosedTitle>
    <CssPractice1 />
  </Post>
  <Post date="August 29, 2020" title="v2" enclosedTitle>
    <p>
      I previously implemented my personal website using Vue.js, but it quickly
      became hard to maintain without a proper component structure. So I rewrote
      this site with React since I'm more familiar with it now than I am with
      Vue.js.
    </p>
    <p>
      Hopefully the ease of modifying content will encourage me to write more
      often.
    </p>
  </Post>
  <Post date="May 31, 2020" title="Unrest" enclosedTitle>
    <p>
      Reflecting on my upbringing, I grew up in a sheltered, educated, and
      diverse neighborhood. For this reason, I don't feel entitled to the
      conviction that the world is feeling. But I am hurt. I am angry, I am
      confused, I am baffled, I am tired.
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
        How can someone watch these events of police brutality events happening
        and say "this is just an accident"?
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
      I urge everyone to reflect and ask themselves these questions, and I hope
      you feel as troubled as I do.
    </p>
  </Post>
</div>

<style>
  div {
    display: grid;
  }
</style>
