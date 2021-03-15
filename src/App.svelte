<script>
  import AllPosts from "./posts/AllPosts.svelte";
  import MetaHeader from "./Header.svelte";
</script>

<main>
  <div class="container">
    <MetaHeader />
    <AllPosts />
  </div>
</main>

<style>
  :global(html) {
    font-size: 14px;
  }

  /* probably don't need a grid here... */
  .container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: grid;
    padding: 0 25vw;
    justify-content: center;
    padding-top: 2rem;
    grid-template-rows: 3rem;
    grid-auto-rows: min-content;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
