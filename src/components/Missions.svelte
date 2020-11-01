<script>

</script>
<div class="container">
  <div class="wrapper">
    <div id="missions" class="missions m-auto">
    <p>
        Wesh le sang, <br>
        <br>
        Si tu peux voir détruit <br>
         l'ouvrage de ta vie<br>
        Et sans dire un seul mot<br> 
        te mettre à rebâtir,<br>
        Ou perdre en un seul coup <br>
        le gain de cent parties
        Sans un geste et sans un soupir ; <br><br><br>
        
        Si tu peux rester digne <br>
        en étant populaire,<br>
        Si tu peux rester peuple<br>
         en conseillant les rois,<br>
        Et si tu peux aimer tous tes ami(e)s <br> en soeurs oufrères,<br>
        Sans qu'aucun d'eux soit tout pour toi ;<br>
        <br> <br>
        MASSEZ-LES <br><br>
        AMASSEZ L'OSEILLE <br>      
    </p>
</div>
</div>
</div>




<style>

    .container{
      overflow:hidden; 
      width:400px; 
      height:300px; 
    }

    .wrapper {
      position:relative; 
      overflow:hidden; 
        width:380px; 
        height: 50px; 
        display: flex;
        justify-content: center;
        position: relative;
        height: 800px;
        color: #feda4a;
        font-family: 'Pathway Gothic One', sans-serif;
        font-size: 150%;
        font-weight: 600;
        letter-spacing: 6px;
        /* line-height: 150%; */
        perspective: 400px;
        text-align: justify;
}

.missions {
  position: absolute;
  top: 99999px;
  transform-origin: 50% 100%;
  animation: crawl 100s linear;
  /* border:2px solid pink;  */

}


@keyframes crawl {
    0% {
    top: -100px;
    transform: rotateX(20deg)  translateZ(0);
  }
    100% { 
    top: -6000px;
    transform: rotateX(25deg) translateZ(-2500px);
  }
}



</style>