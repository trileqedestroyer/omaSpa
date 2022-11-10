
'use strict';

(function() {
    let idKentta;
    let etunimiKentta;
    let sukunimiKentta;
    let osastoKentta;
    let palkkaKentta;

    document.addEventListener('DOMContentLoaded', alusta);

    function alusta(){
        idKentta = document.getElementById('id');
        etunimiKentta = document.getElementById('etunimi');
        sukunimiKentta = document.getElementById('sukunimi');
        osastoKentta = document.getElementById('osasto');
        palkkaKentta = document.getElementById('palkka');

        document.getElementById('laheta')
            .addEventListener('click', laheta);
    } //alusta loppu

    async function laheta() {
        tyhjennaViestiAlue();
        const henkilo={
            id: +idKentta.value,
            etunimi: etunimiKentta.value,
            sukunimi: sukunimiKentta.value,
            osasto: osastoKentta.value,
            palkka: +palkkaKentta.value
        };
        try{
            const optiot={
                method: 'POST',
                body: JSON.stringify(henkilo),
                headers:{
                    'Content-Type':'application/json'
                }
            };
            const data = await fetch('/lisaa',optiot);
            const tulosJson = await data.json();

            if(tulosJson.viesti){
                paivitaViestiAlue(tulosJson.viesti, tulosJson.tyyppi);
            }
        }
        catch(virhe){
            paivitaViestiAlue(virhe.message,'virhe');
        }
    }

})();