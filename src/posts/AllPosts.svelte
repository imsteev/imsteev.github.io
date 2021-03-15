<script>
  import PostLexicalScope from "./PostLexicalScope.svelte";
  import PostCssPractice from "./PostCSSPractice.svelte";
  import PostShibaGenerator from "./PostShibaGenerator.svelte";
  import PostUnrest from "./PostUnrest.svelte";
  import PostV2 from "./PostV2.svelte";
  import PostV3 from "./PostV3.svelte";
</script>

<div>
  <h1>Thoughts and experiments</h1>
  <PostLexicalScope />
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
