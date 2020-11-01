<style>

.container{
    width:150px; 
    height: 130px; 
    position:absolute;
    overflow:hidden; 
    bottom:0; 
    left:50px; 
  }
  #block{
    z-index:0;
    position:absolute;  
    bottom:0; 
    left:0; 
  }

  .container2{
    width:135px; 
    height: 130px; 
    position:absolute;
    overflow:hidden; 
    bottom:20px; 
    right:-90px; 
    transform:skew(0, 25deg);
  }

  #block2{
    z-index:0;
    position:absolute;  
    right:83px; 
  }


  .container3{
    width:100px; 
    height: 170px; 
    position:absolute;
    overflow:hidden; 
    top:5px; 
    left:-60px; 
    transform: skew(0, 36deg)
  }

  #block3{
    z-index:0;
    position:absolute;  
    left:58px; 
  }

  .container4{
    width:100px; 
    height: 170px; 
    position:absolute;
    overflow:hidden; 
    top:40px; 
    right:0px; 
    transform: skew(0, -38deg)
  }

  #block4{
    z-index:0;
    position:absolute;  
    left:70px; 
  }
</style>


<div class="container">
    <img src="./resources/block.png" alt="" id="block" class="absolute" /> 
  </div>

  <div class="container2">
    <img src="./resources/block.png" alt="" id="block2" class="absolute" /> 
  </div>

  <div class="container3">
    <img src="./resources/block.png" alt="" id="block3" class="absolute" /> 
  </div>

  <div class="container4">
    <img src="./resources/block.png" alt="" id="block4" class="absolute" /> 
  </div>