<script>
  import Post from "./Post.svelte";
  import Flex from "../common/Flex.svelte";
  import Button from "../common/Button.svelte";

  const randomShibaUrl = "https://dog.ceo/api/breed/shiba/images/random";

  $: randomDogUrl = "";
  $: loadingDog = false;

  const randomDogRefresh = () => {
    loadingDog = true;
    fetch(randomShibaUrl, {})
      .then((resp) => {
        if (!resp.ok) {
          throw "Request failed";
        }
        return resp.json();
      })
      .then((jsonResp) => (randomDogUrl = jsonResp.message))
      .finally(() => {
        loadingDog = false;
      });
  };

  $: {
    randomDogRefresh();
  }
</script>

<Post title="Shiba Generator" date="August 31, 2020" enclosedTitle>
  <Button onClick={randomDogRefresh}>another shiba</Button>
  <Flex>
    <figure style={{ padding: 0, margin: "1rem 0" }}>
      {#if !loadingDog}
        <img alt="random-shiba" src={randomDogUrl} />
      {:else}
        Loading doge...
      {/if}
    </figure>
  </Flex>
</Post>

<style>
  img {
    max-height: 512px;
    max-width: 512px;
    object-fit: cover;
  }
</style>
