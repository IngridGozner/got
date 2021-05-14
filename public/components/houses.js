Vue.component('datatablehouses', {
  data: function () {
    return {
      gotHouses: [],
      gotCharacters: [],

      dialog: false,
      house: {},
      keyTitle: ['Region', 'Coat Of Arms', 'Words', 'Titles', 'Seats', 'Current Lord', 'Heir', 'Overlord', 'Founded', 'Founder', 'Died Out','Ancestral Weapons', 'Cadet Branches', 'Sworn Members'],
      keys:['region', 'coatOfArms', 'words', 'titles', 'seats', 'currentLord', 'heir', 'overlord', 'founded', 'founder', 'diedOut', 'ancestralWeapons', 'cadetBranches', 'swornMembers'],

      headers: [
       { text: 'House Name', value: 'name' },
     ],
    }
  },
  created: function() {
      console.log('gotHouses created');

      Promise.all([
        fetch("https://www.anapioficeandfire.com/api/houses?page=1&pageSize=50").then(resp => resp.json()),
        fetch("https://www.anapioficeandfire.com/api/houses?page=2&pageSize=50").then(resp => resp.json()),
        fetch("https://www.anapioficeandfire.com/api/houses?page=3&pageSize=50").then(resp => resp.json()),
        fetch("https://www.anapioficeandfire.com/api/houses?page=4&pageSize=50").then(resp => resp.json()),
        fetch("https://www.anapioficeandfire.com/api/houses?page=5&pageSize=50").then(resp => resp.json()),
        fetch("https://www.anapioficeandfire.com/api/houses?page=6&pageSize=50").then(resp => resp.json()),
        fetch("https://www.anapioficeandfire.com/api/houses?page=7&pageSize=50").then(resp => resp.json()),
        fetch("https://www.anapioficeandfire.com/api/houses?page=8&pageSize=50").then(resp => resp.json()),
        fetch("https://www.anapioficeandfire.com/api/houses?page=9&pageSize=50").then(resp => resp.json())
      ]).then(data => {
        for(let i in data)
          this.gotHouses = this.gotHouses.concat(data[i]);
      })

    },

  // mounted: function() {
  //   if (localStorage.getItem('gotHouses')) {
  //     try {
  //       this.gotHouses = JSON.parse(localStorage.getItem('gotHouses'));
  //     } catch(e) {
  //       localStorage.removeItem('gotHouses');
  //     }
  //   }
  // },

  methods: {
    async opendialog(houseIndex){
      let gHouse = this.gotHouses[houseIndex];

      let overlordURL = gHouse.overlord;
      let currentLordURL = gHouse.currentLord;
      let heirURL = gHouse.heir;
      let founderURL = gHouse.founder;

      let houses = this.gotHouses;
      let characters = this.gotCharacters;
      let newCharacters = [];

      let swornMembersArrayURL = gHouse.swornMembers;
      let swornMembersArray = [];

      let cadetBranchesArrayURL = gHouse.cadetBranches;
      let cadetBranchesArray = [];

      if(currentLordURL != "" && currentLordURL.startsWith('https')){
        this.gotHouses[houseIndex].currentLord = await this.getCharacterName(currentLordURL);
      }
      if(heirURL != "" && heirURL.startsWith('https')){
        this.gotHouses[houseIndex].heir = await this.getCharacterName(heirURL);
      }
      if(founderURL != "" && founderURL.startsWith('https')){
        this.gotHouses[houseIndex].founder = await this.getCharacterName(founderURL);
      }
      if(overlordURL != "" && overlordURL.startsWith('https')){
        this.gotHouses[houseIndex].overlord = this.gotHouses.find(house => house.url === overlordURL).name;
      }

      if(cadetBranchesArrayURL.length != "" && cadetBranchesArrayURL[0].startsWith('https')){
        cadetBranchesArrayURL.forEach(function(branchURL){
          cadetBranchesArray.push(houses.find(house => house.url === branchURL).name);
        })

        this.gotHouses[houseIndex].cadetBranches = cadetBranchesArray;
      }

      if(swornMembersArrayURL.length != "" && swornMembersArrayURL[0].startsWith('https')){
        let urls = [];
        swornMembersArrayURL.forEach(function(memberURL){
          let member = characters.find(c => c.url === memberURL);
          if(member != undefined){
            swornMembersArray.push(member.name);
          }
          else{
            urls.push(memberURL);
          }
        });

        await Promise.all(urls.map(u=>fetch(u))).then(responses =>
              Promise.all(responses.map(res => res.json()))
          ).then(data => {
            data.forEach(function(item) {
              newCharacters.push(item);
              swornMembersArray.push(item.name);
            });
          });

          this.gotCharacters = this.gotCharacters.concat(newCharacters);
          newCharacters = [];

        this.gotHouses[houseIndex].swornMembers = swornMembersArray;
      }

      this.house = this.gotHouses[houseIndex];

      this.dialog = true;
    },

    async getCharacterName(url){
      let character = this.gotCharacters.find(character => character.url === url);

      if(character != null){
        console.log('return without fetching');
        return character.name;
      }
      else{
        await fetch(url)
          .then(response => response.json())
          .then(data => {
            character = data;
            this.gotCharacters.push(character);
            console.log('in fetching char: '+ character.name);

          });
          return character.name;
      }
    }
  },

  template: `
  <v-container fluid>

  <v-row justify="center">
      <v-card width="900" color="rgba(0, 0, 0, 0.6)">

      <v-card-title>
        <slot name="title"></slot>
        <v-spacer></v-spacer>
      </v-card-title>

      <v-dialog
        v-model="dialog"
        width="600"
      >

      <v-card>

           <v-card-title style="font-size:26px; font-family: 'Uncial Antiqua', cursive; text-shadow: 2px 2px 4px #000000;" class="white--text">
               {{ house.name }}
           </v-card-title>
         </v-img>

         <v-card-text>

           <v-timeline
             align-top
             dense
           >
             <v-timeline-item
                v-for="(element, index) in keys"
                :key="index"
                small
             >
               <div>
                 <div class="font-weight-normal">
                   <strong>{{ keyTitle[index] }}</strong>
                 </div>

                 <div v-if="house[element] == '' "> Unknown </div>
                 <div v-else-if="element == 'titles' || element == 'seats' || element == 'swornMembers' || element == 'cadetBranches' || element == 'ancestralWeapons'">
                 <v-list-item v-for="(el, index) in house[element]" :key="index">
                    <v-list-item-content>
                      <v-list-item-subtitle>{{ el }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                 </div>

                 <div v-else-if="house[element] != ''">{{ house[element] }}</div>

               </div>
             </v-timeline-item>
           </v-timeline>
         </v-card-text>
       </v-card>
      </v-dialog>

      <v-data-table
        :headers="headers"
        :items="gotHouses"
        :items-per-page="10"
        class="elevation-1">
        <template slot="item" slot-scope="props">
          <tr @click="opendialog(props.index)">
             <td>{{ props.item.name }}</td>
          </tr>
        </template>
      </v-data-table>

    </v-card>
    </v-row>
  </v-container>
`
})
