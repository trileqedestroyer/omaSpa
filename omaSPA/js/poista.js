'use strict';

(function(){
    let syote;

    document.addEventListener('DOMContentLoaded', alusta);

    function alusta(){
        syote=document.getElementById('id');
        document.getElementById('laheta')
            .addEventListener('click', laheta);
    } //alusta loppu

    async function laheta(){
        tyhjennaViestiAlue();
        const id=syote.value;
        try{
            const optiot={
                method:'POST',
                body:JSON.stringify({id}),
                headers:{
                    'Content-Type':'application/json'
                }
            };
            const data = await fetch('/poista',optiot);
            const tulos = await data.json();
            if(tulos.viesti){
                paivitaViestiAlue(tulos.viesti,tulos.tyyppi);
            }
        }
        catch(virhe){
            paivitaViestiAlue(virhe.message, 'virhe');
        }
    } //laheta loppu

})();