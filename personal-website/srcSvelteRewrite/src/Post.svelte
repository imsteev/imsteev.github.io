<script>
  export let date;
  export let title;
  export let enclosedTitle = false;
</script>

<div>
  <p class="header">
    {date}
    {title && enclosedTitle ? `"${title}"` : title}
    <slot />
  </p>
</div>

<style>
  div {
    border-bottom: solid 1px grey;
    line-height: 24px;
  }

  .header {
    justify-self: start;
  }
</style>
