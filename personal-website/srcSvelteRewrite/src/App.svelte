<main>
  <div class="container">
    <div class="meta-info-container">
      <div>Stephen Chung</div>
      <div>
        <a href="https://www.github.com/imsteev" target="_blank">github</a>
        &nbsp;
        <a href="https://www.linkedin.com/in/imsteev/" target="_blank">
          linkedin
        </a>
      </div>
    </div>
  </div>
</main>

<style>
  /* probably don't need a grid here... */
  .container {
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
  }

  .meta-info-container {
    display: flex;
    justify-content: space-between;
    align-self: center;
    padding-right: 2rem;
    font-size: 0.9rem;
  }

  a {
    color: #3454d1;
    text-decoration: none;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
