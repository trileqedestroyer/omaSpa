'use strict';

(function(){
    let idKentta;
    let etunimiKentta;
    let sukunimiKentta;
    let osastoKentta;
    let palkkaKentta;
    let hakuTila=true;

    document.addEventListener('DOMContentLoaded', alusta);

    function alusta(){
        idKentta=document.getElementById('id');
        etunimiKentta=document.getElementById('etunimi');
        sukunimiKentta=document.getElementById('sukunimi');
        osastoKentta=document.getElementById('osasto');
        palkkaKentta=document.getElementById('palkka');

        paivitaKentat();

        document.getElementById('laheta')
            .addEventListener('click', laheta);

        idKentta.addEventListener('focus', tyhjenna);
    } //alusta loppu

    function tyhjenna(){
        if(hakuTila){
            tyhjennaKentat();
            tyhjennaViestiAlue();
        }
    }
    
    function paivitaKentat(){
        if(hakuTila){
            idKentta.removeAttribute('readonly');
            etunimiKentta.setAttribute('readonly', true);
            sukunimiKentta.setAttribute('readonly', true);
            osastoKentta.setAttribute('readonly', true);
            palkkaKentta.setAttribute('readonly', true);
        }
        else{
            idKentta.setAttribute('readonly', true);
            etunimiKentta.removeAttribute('readonly');
            sukunimiKentta.removeAttribute('readonly');
            osastoKentta.removeAttribute('readonly');
            palkkaKentta.removeAttribute('readonly');
        }
    }//paivitaKentat loppu

    function paivitaHenkilotiedot(henkilo){
        idKentta.value = henkilo.id;
        etunimiKentta.value = henkilo.etunimi;
        sukunimiKentta.value = henkilo.sukunimi;
        osastoKentta.value = henkilo.osasto;
        palkkaKentta.value = henkilo.palkka
        hakuTila=false;
        paivitaKentat();
    }//paivitaHenkilotiedot loppu

    function tyhjennaKentat(){
        idKentta.value='';
        etunimiKentta.value='';
        sukunimiKentta.value='';
        osastoKentta.value='';
        palkkaKentta.value='';
        hakuTila=true;
        paivitaKentat();
    } //tyhjennaKentat loppu

    async function laheta(){
        try{
            if(hakuTila){
                //hae henkilo
                tyhjennaViestiAlue();
                const id=idKentta.value;
                const optiot={
                    method:'POST',
                    body:JSON.stringify({id}),
                    headers:{
                        'Content-Type':'application/json'
                    }
                };
                const data = await fetch('/haeYksi',optiot);
                const hakutulos = await data.json();

                if(hakutulos){
                    if(hakutulos.viesti){
                        paivitaViestiAlue(hakutulos.viesti,hakutulos.tyyppi);
                    }
                    else{
                        paivitaHenkilotiedot(hakutulos);
                    }
                }
                else {
                    paivitaViestiAlue('Ei löytynyt','virhe');
                }
            }
            else{
                const henkilo = {
                    id: +idKentta.value,
                    etunimi: etunimiKentta.value,
                    sukunimi: sukunimiKentta.value,
                    osasto: osastoKentta.value,
                    palkka: +palkkaKentta.value
                };
                const optiot = {
                    method: 'POST',
                    body: JSON.stringify(henkilo),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };

                const data = await fetch('/paivita', optiot);
                const tulosJson = await data.json();

                if(tulosJson.viesti){
                    paivitaViestiAlue(tulosJson.viesti, tulosJson.tyyppi);
                }
                hakuTila=true;
                paivitaKentat();
            }

        }
        catch(virhe){
            paivitaViestiAlue(virhe.message, 'virhe');
        }
    }


})();