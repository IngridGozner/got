Vue.component('datatablehouses', {
  data: function () {
    return {
      gotHouses: [],
      gotCharacters: [],

      dialog: false,
      search: '',
      isActive: false,

      house: {},
      keyTitle: ['Region', 'Coat Of Arms', 'Words', 'Titles', 'Seats', 'Current Lord', 'Heir', 'Overlord', 'Founded', 'Founder', 'Died Out','Ancestral Weapons', 'Cadet Branches', 'Sworn Members'],
      keys:['region', 'coatOfArms', 'words', 'titles', 'seats', 'currentLord', 'heir', 'overlord', 'founded', 'founder', 'diedOut', 'ancestralWeapons', 'cadetBranches', 'swornMembers'],

      regionImages: {'The Reach': '../pictures/houseTyrell.png', 'The Vale': '../pictures/houseArryn.png', 'The North': '../pictures/houseStark.png', 'The Riverlands': '../pictures/houseTully.png', 'The Westerlands': '../pictures/houseLannister.png', 'The Crownlands': '../pictures/houseTargaryen.png', 'Iron Islands': '../pictures/houseGreyjoy.png', 'Dorne': '../pictures/houseMartell.png', 'The Neck': '../pictures/houseReed.png', 'The Stormlands': '../pictures/houseBaratheon.png'},


      headers: [
       { text: 'House Name', value: 'name' },
        { text: 'Words', value: 'words' },
       { text: 'Region', value: 'regionImages'}
     ],
    }
  },
  created: function() {
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

  methods: {
    async opendialog(houseURL){
      let houseIndex = this.gotHouses.findIndex(house => house.url === houseURL);
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
        fetch(currentLordURL).then(resp =>resp.json()
          ).then(data => {this.gotHouses[houseIndex].currentLord = data.name})
      }
      if(heirURL != "" && heirURL.startsWith('https')){
        fetch(heirURL).then(resp =>resp.json()
          ).then(data => {this.gotHouses[houseIndex].heir = data.name})
      }
      if(founderURL != "" && founderURL.startsWith('https')){
        fetch(founderURL).then(resp =>resp.json()
          ).then(data => {this.gotHouses[houseIndex].founder = data.name})
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

        Promise.all(urls.map(u=>fetch(u).then(responses =>
              responses.json()))
          ).then(data => {
            data.forEach(function(item) {
              newCharacters.push(item);
              swornMembersArray.push(item.name);
            });
          });

          this.gotCharacters = this.gotCharacters.concat(newCharacters);

        this.gotHouses[houseIndex].swornMembers = swornMembersArray;
      }

      this.house = this.gotHouses[houseIndex];

      this.dialog = true;

    },

    scrollToTop(){
      document.getElementsByClassName('v-dialog--active')[0].scrollTop = 0;
      this.dialog = false;
    }
  },

  template: `
  <v-container fluid>

  <v-row justify="center">
      <v-card width="900" color="rgba(0, 0, 0, 0.6)">

      <v-card-title>
        <slot name="title"></slot>
        <v-spacer></v-spacer>

        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>

      </v-card-title>

      <v-dialog
        v-model="dialog"
        width="500"
        @click:outside="scrollToTop"
      >

      <v-card>
           <v-card-title style="word-break: normal; font-size:30px; font-family: 'Uncial Antiqua', cursive; text-shadow: 2px 2px 4px #000000;" class="white--text">
               {{ house.name }}
           </v-card-title>
         </v-img>
         <v-spacer></v-spacer>
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

                 <div v-if="house[element] == '' ">Unknown</div>

                 <div v-else-if="element == 'titles' || element == 'seats' || element == 'swornMembers' || element == 'cadetBranches' || element == 'ancestralWeapons'">
                 <v-list-item v-for="(el, index) in house[element]" :key="index">
                    <v-list-item-content>
                      <v-list-item-subtitle>{{ el }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                 </div>

                 <div v-else-if="house[element] != '' ">{{ house[element] }}</div>

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
        :search="search"
        class="elevation-1"
        >
        <template v-slot:item="{ item }">
          <tr @click="opendialog(item.url)">
             <td>{{ item.name }}</td>
             <td>{{ item.words }}</td>
             <td>
               <v-img v-if="regionImages[item.region] != undefined"
                  width="80px"
                  :src="\`\${regionImages[item.region]}\`"
                  :lazy-src="\`\${regionImages[item.region]}\`"
                ></v-img>
                <v-img v-else
                   width="80px"
                   :src="\`\../pictures/undefined.png\`"
                   :lazy-src="\`\../pictures/undefined.png\`"
                 ></v-img>
              </td>
          </tr>
        </template>
      </v-data-table>

    </v-card>
    </v-row>
  </v-container>
`
})
