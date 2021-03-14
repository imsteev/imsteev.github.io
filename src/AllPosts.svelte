<script>
  import PostCssPractice from "./posts/PostCSSPractice.svelte";
  import PostShibaGenerator from "./posts/PostShibaGenerator.svelte";
  import PostUnrest from "./posts/PostUnrest.svelte";
  import PostV2 from "./posts/PostV2.svelte";
  import PostV3 from "./posts/PostV3.svelte";
</script>

<div>
  <h1>Thoughts and experiments</h1>
  <PostV3 />
  <PostShibaGenerator />
  <PostCssPractice />
  <PostV2 />
  <PostUnrest />
</div>

<style>
  div {
    display: grid;
  }

  h1 {
    color: #0a53ab;
  }
</style>
