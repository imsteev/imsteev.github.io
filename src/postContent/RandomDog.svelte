<script>
  import Flex from "./../common/Flex.svelte";
  import Button from "../common/Button.svelte";

  export let breed;

  $: randomDogUrl = "";
  $: loadingDog = false;

  const randomDogRefresh = () => {
    loadingDog = true;
    fetch(`https://dog.ceo/api/breed/${breed}/images/random`, {})
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

<div>
  <Button onClick={randomDogRefresh}>another {breed}</Button>
  <Flex>
    <figure style={{ padding: 0, margin: "1rem 0" }}>
      {#if !loadingDog}
        <img alt="random-shiba" src={randomDogUrl} />
      {:else}
        Loading doge...
      {/if}
    </figure>
  </Flex>
</div>
