const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const fetch = require("node-fetch");

async function loadHouses(req, res){
  let gotHouses = await getData('https://anapioficeandfire.com/api/houses/');

  res.render('pages/houses', {gothouses: gotHouses});
}

async function getData(url) {
    const response = await fetch(url);
    let data = await response.json();

    let swornMembersURL = [];
    let swornMembers = [];

    let cadetBranchesURL = [];
    let cadetBranches = [];

    let gotHouses = [];

    for(let house of data){
      try {

        if(house.overlord != ""){
          house.overlord = await getName(house.overlord);
        }
        if(house.currentLord != ""){
          house.currentLord = await getName(house.currentLord);
        }
        if(house.heir != ""){
          house.heir = await getName(house.heir);
        }
        if(house.founder != ""){
          house.founder = await getName(house.founder);
        }

      if(house.swornMembers.length != 0){
        swornMembersURL = [];
        swornMembers = [];

        house.swornMembers.forEach(function(url){
          swornMembersURL.push(url);
        })

        let response = await Promise.all(swornMembersURL.map((url, i) =>
              fetch(url).then(resp => resp.json())
          )).then(json=> {
              json.forEach(function(el){
                swornMembers.push(el.name)
              })
          })

        house.swornMembers = swornMembers;
      }

      if(house.cadetBranches.length != 0){
        cadetBranchesURL = [];
        cadetBranches = [];

        house.cadetBranches.forEach(function(url){
          cadetBranchesURL.push(url);
        })

        let response = await Promise.all(cadetBranchesURL.map((url, i) =>
              fetch(url).then(resp => resp.json())
          )).then(json=> {
              json.forEach(function(el){
                cadetBranches.push(el.name)
              })
          })

        house.cadetBranches = cadetBranches;
      }

      }catch (error) {
        console.error(error);
      }

      gotHouses.push(house);
    }

    return gotHouses;
}

async function getName(url){
  const response = await fetch(url);
  let data = await response.json();

  return data.name;
}

express()
  .use(express.static(path.join(__dirname, 'public')))
  .use(express.json())
  .use(require('body-parser').urlencoded({ extended: true }))
  .use(require('express-session')({ secret: 'jdgshgfgei', resave: true, saveUninitialized: true }))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => loadHouses(req, res))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
