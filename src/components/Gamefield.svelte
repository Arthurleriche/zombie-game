<script>
  // -----------------------------------------------------------
  // let development = process.env.isDev;
  // console.log(process.env.isDev);
  // if (process.env.NODE_ENV === 'production') {
  //   console.log('je suis en prod');
  // } else {
  //   console.log('je suis sur le serve');
  // }
// -----------------------------------------------------------
</script>

  <div class="gamefield m-auto">
    <slot/>
  </div>

<style>
   .gamefield{
    height: 570px; 
    width:900px;
    border: 3px solid white; 
 
  }
</style>
