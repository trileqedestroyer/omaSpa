'use strict';

function muunna(olio){
    // console.log('Obj. Assign');
    return Object.assign(olio, {
        id: +olio.id,
        palkka: +olio.palkka
    });
}

module.exports={muunna}