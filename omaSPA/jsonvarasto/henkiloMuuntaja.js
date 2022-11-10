'use strict';

function muunna(olio){
    return {
        id: +olio.id,
        etunimi: olio.etunimi,
        sukunimi: olio.sukunimi,
        osasto: olio.osasto,
        palkka: +olio.palkka  //myös palkka: Number(olio.palkka)
    }
}

module.exports={muunna}