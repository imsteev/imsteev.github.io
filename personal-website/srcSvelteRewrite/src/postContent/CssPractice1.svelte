<script>
  import Flex from "../common/Flex.svelte";
  import Button from "../common/Button.svelte";
  $: isPlaying = false;
</script>

<div>
  <div>
    <Button onClick={() => (isPlaying = !isPlaying)}>
      {isPlaying ? "pause animations" : "play animations"}
    </Button>
    <Flex>
      <p>Look it's a rotating square</p>
      <div class={`box animate-${isPlaying}`} id="animation-1" />
      <p>This one's a mover</p>
      <div class={`box animate-${isPlaying}`} id="animation-2" />
    </Flex>
  </div>
</div>

<style>
  .box {
    width: 1.4rem;
    height: 1.4rem;
  }

  @keyframes Rotate {
    to {
      transform: rotate(359deg);
    }
  }

  #animation-1 {
    background-color: blue;
    transition: background-color 0.4s;
    margin: 1rem;
  }

  #animation-1.animate-true {
    animation: Rotate 4s linear infinite;
  }

  #animation-1:hover {
    background-color: #fea423;
  }

  @keyframes Pace {
    0% {
      transform: translateX(0);
    }

    25% {
      transform: translateX(6rem);
    }

    50% {
      transform: translateX(12rem);
    }
    75% {
      transform: translateX(6rem);
    }
    100% {
      transform: translateX(0);
    }
  }

  #animation-2 {
    background-color: seagreen;
    margin: 1rem;
  }

  #animation-2.animate-true {
    animation: Pace 1s linear infinite;
  }
</style>
