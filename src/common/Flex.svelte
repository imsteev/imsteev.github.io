<script>
  export let justifyContent;
</script>

<div style={justifyContent ? `justify-content: ${justifyContent}` : ""}>
  <slot />
</div>

<style>
  div {
    display: flex;
    align-content: center;
  }
</style>
