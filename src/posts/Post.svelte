<script>
  export let date;
  export let title;
</script>

<div class="post-container">
  <div class="header-title">
    <div class="title">{title}</div>
    <div>{date}</div>
  </div>
  <div />
  <slot />
</div>

<style>
  .post-container {
    line-height: 24px;
  }

  .header-title > .title {
    font-size: 1.5rem;
    color: rgb(32, 110, 161);
    line-height: 2.2rem;
  }

  .header-title + div {
    border-bottom: solid 1px rgb(219, 215, 215);
    margin-bottom: 1rem;
  }

  .header-title {
    display: flex;
    justify-content: space-between;
  }
</style>
