<script>


</script>



<div class="controls flex flex-col space-y-5 ">
    <div class="flex mx-auto">
        <div class="a touche"> a</div>
        <p>CHANGE WEAPON</p>
    </div>
    
    <div class="flex mx-auto">
        <div class="space">space </div>
        <p>FIRE</p>
    </div>
    

    <div class="flex mx-auto">
        <div class="arrows">
            <div class="arrow Up ml-10"> . </div>
            <div class="flex">
                <div class="arrow Right"> . </div>
                <div class="arrow Down"> . </div>
                <div class="arrow Left"> . </div>
            </div>
            
        </div>
        <p class="mt-4">MOVE</p>
    </div>
    
    
</div>


<style>
    p{
        color:white; 
        padding-top: 7px; 
        margin-left:20px; 
    }
    .controls{
        width:400px;
        height:250px; 
        margin-top:40px; 
        /* border: 3px dashed white;  */
    }

    .touche , .arrow {
        width:40px; 
        height: 40px; 
        border:2px solid white;
        border-radius: 5px; 
        text-align: center;
        color:white; 
        font-size: 1.3rem; 
        background-color: rgb(148, 146, 146); 
        opacity:0.6;
    }

    .space{
        width: 250px; 
        height: 40px; 
        border:2px solid white;
        border-radius: 5px; 
        color:white; 
        background-color: rgb(148, 146, 146); 
        opacity:0.6;
    }
</style>