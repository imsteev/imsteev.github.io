<script>
  export let onClick;
</script>

<button on:click={onClick}>
  <slot />
</button>

<style>
  button {
    border: none;
    cursor: pointer;
    padding: 0 1.4rem;
    height: 3rem;
    box-shadow: 3px 2px 4px 0 rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    background: linear-gradient(to right, #6930c3, #7400b8);
    color: #f0efeb;
    transition: all 0.3s;
  }

  button:hover {
    opacity: 0.9;
  }
  button:active {
    opacity: 0.8;
    box-shadow: none;
    background: linear-gradient(to right, #7400b8, #6930c3);
  }
  button:focus {
    outline: none;
  }
</style>
