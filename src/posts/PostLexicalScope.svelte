<script>
  import Tldr from "../common/Tldr.svelte";
  import Post from "./Post.svelte";
</script>

<Post date="March 14, 2021" title="Lexical scope in Javascript">
  <p>
    For the longest time, I didn't understand what "lexical scope" in Javascript
    meant; it's dictionary definition does not reveal much information in
    relation to Javascript (at first):
  </p>
  <div>
    <span class="definition">
      relating to the words or vocabulary of a language
    </span>
  </div>
  <p>
    What does this even mean?! After sifting through the Internet, <a
      href="https://astronautweb.co/javascript-lexical-scope/"
      target="_blank">I finally found a solid explanation</a
    >
    that considers why "lexical" is used in the first place. Essentially,
    <strong
      >lexical scope is the set of reachable variables defined at compile time
      from a given scope</strong
    >.
  </p>

  <div>
    Javascript recognizes two types of scopes: global and function. Global scope
    is accessible from any scope in a script. Function scope consists of those
    variables defined within a function itself. If you have a function called
    <italic>inner()</italic>
    defined in a function called
    <italic>outer()</italic>
    ,
    <italic>inner()</italic>
    would be able to use variables defined in the lexical scope of
    <italic>outer()</italic>.
  </div>

  <Tldr>
    tl;dr: Lexical scope is just an umbrella phrase for "the scope that
    Javascript determines at compile time", which unfortunately sounds like "it
    depends".
  </Tldr>
</Post>

<style>
  .definition {
    display: block;
    text-indent: 2rem;
  }

  italic {
    font-style: italic;
  }
</style>
