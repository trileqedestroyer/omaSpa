'use strict';
//noden kirjastot
const http = require('http');
const path = require('path');

//asetukset
const {
    port, 
    host, 
    verkkosivut, 
    varastokansio, 
    kirjastokansio} = require('./config.json');

//omat kirjastot
const kirjastopolku=path.join(__dirname,kirjastokansio);
const {lue} = require(path.join(kirjastopolku,'tiedostokasittelija'));
const {
    kasittelePostData
} = require(path.join(kirjastopolku,'postkasittelija'));

const {
    laheta,
    onJoukossa,
    lahetaJson,
    lahetaStatus
} = require(path.join(kirjastopolku,'apufunktiot'));

const Tietovarasto = 
    require(path.join(__dirname,varastokansio,'tietovarastokerros'));

const tietovarasto= new Tietovarasto();

const resurssiReitit=['/favicon','/tyylit/','/js/'];

//polut
const valikkoPolku = path.join(__dirname,verkkosivut.kansio,verkkosivut.valikko);

const sivureitit = verkkosivut.sivureitit;


const palvelin = http.createServer(async (req,res)=>{
    const {pathname} = new URL(`http://${host}:${port}${req.url}`);
    const reitti = decodeURIComponent(pathname);

    const metodi = req.method.toUpperCase();

    if(metodi==='GET'){
        try {
            if(reitti==='/'){
                laheta(res,await lue(valikkoPolku));
            }
            else if(reitti==='/kaikki'){
                lahetaJson(res, await tietovarasto.haeKaikki());
            }
            else if (onJoukossa(reitti, ...resurssiReitit)) {
                laheta(res, await lue(path.join(__dirname, reitti)));
            }
            else if(onJoukossa(reitti, ...Object.keys(sivureitit))){
                const polku=path.join(__dirname,verkkosivut.kansio,sivureitit[reitti]);
                // console.log(polku);
                laheta(res,await lue(polku));
            }
            else {
                lahetaStatus(res, 'Resurssi ei ole käytössä');
            }
        }
        catch (virhe) {
            lahetaStatus(res, 'Virhe luettaessa resurssia');
        }
    }
    else if(metodi==='POST'){
        if(reitti==='/haeYksi'){ 
            kasittelePostData(req)
                .then(tulos => tietovarasto.hae(tulos.id))
                .then(hakutulos=>lahetaJson(res, hakutulos))
                .catch(virhe=>lahetaJson(res,virhe));
        }
        else if(reitti==='/lisaa'){
            kasittelePostData(req)
                .then(tulos => tietovarasto.lisaa(tulos))
                .then(status => lahetaJson(res, status))
                .catch(virhe => lahetaJson(res, virhe));
        }
        else if (reitti === '/paivita') {
            kasittelePostData(req)
                .then(tulos => tietovarasto.paivita(tulos))
                .then(status => lahetaJson(res, status))
                .catch(virhe => lahetaJson(res, virhe));
        }
        else if (reitti === '/poista') {
            kasittelePostData(req)
                .then(tulos => tietovarasto.poista(tulos.id))
                .then(status => lahetaJson(res, status))
                .catch(virhe => lahetaJson(res, virhe));
        }
        else {
            lahetaStatus(res,'Reittiä ei löydy')
        }
    }
    else {
        lahetaStatus(res, 'Metodi ei ole käytössä',405);
    }
}); //palvelimen loppu

palvelin.listen(port,host,
    ()=>console.log(`palvelin ${host}:${port} kuuntelee`));


