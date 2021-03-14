<script>
  export let date;
  export let title;
</script>

<div class="post-container">
  <div class="header-title">
    <div>{title}</div>
    <div>{date}</div>
  </div>
  <div />
  <slot />
</div>

<style>
  .post-container {
    line-height: 24px;
  }

  .header-title + div {
    border-bottom: solid 1px grey;
    margin-bottom: 1rem;
  }

  .header-title {
    display: flex;
    justify-content: space-between;
  }
</style>
