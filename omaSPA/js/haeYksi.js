'use strict';

(function(){
    let tulosalue;
    let syote;

    document.addEventListener('DOMContentLoaded', alusta);

    function alusta(){
        tulosalue = document.getElementById('tulosalue');
        syote = document.getElementById('id');
        document.getElementById('laheta')
            .addEventListener('click',laheta);
    }

    async function laheta(){
        tyhjennaViestiAlue();
        tulosalue.innerHTML='';
        const id = syote.value;
        try{
            const optiot={
                method:'POST',
                body:JSON.stringify({id}),
                headers:{
                    'Content-Type':'application/json'
                }
            };
            const data = await fetch('/haeYksi', optiot);
            const tulosJson = await data.json();
            paivitaSivu(tulosJson);
        }
        catch(virhe){
            paivitaViestiAlue(virhe.message, 'virhe');
        }
    } //laheta loppu

    function paivitaSivu(hakutulos){
        if(hakutulos){
            if(hakutulos.viesti){
                paivitaViestiAlue(hakutulos.viesti, hakutulos.tyyppi);
            }
            else{
                paivitaHenkilotiedot(hakutulos);
            }
        }
        else {
            paivitaViestiAlue('Ei löytynyt', 'virhe');
        }
    } //paivitaSivu loppu

    function paivitaHenkilotiedot(henkilo){
        tulosalue.innerHTML=`
        <p><span class="selite">Id:</span> ${henkilo.id}</p>
        <p><span class="selite">Etunimi:</span> ${henkilo.etunimi}</p>
        <p><span class="selite">Sukunimi:</span> ${henkilo.sukunimi}</p>
        <p><span class="selite">Osasto:</span> ${henkilo.osasto}</p>
        <p><span class="selite">Palkka:</span> ${henkilo.palkka} €</p>
        `;
        tulosalue.removeAttribute('class');
    } //paivitaHenkilotiedot loppu

})();