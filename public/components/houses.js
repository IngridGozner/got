Vue.component('datatablehouses', {
  props: ['gothouses'],
  data: function () {
    return {
      dialog: false,
      house: {},
      keyTitle: ['Region', 'Coat Of Arms', 'Words', 'Titles', 'Seats', 'Current Lord', 'Heir', 'Overlord', 'Founded', 'Founder', 'Died Out','Ancestral Weapons', 'Cadet Branches', 'Sworn Members'],
      keys:['region', 'coatOfArms', 'words', 'titles', 'seats', 'currentLord', 'heir', 'overlord', 'founded', 'founder', 'diedOut', 'ancestralWeapons', 'cadetBranches', 'swornMembers'],
      houseIndex: '',

      headers: [
       { text: 'House Name', value: 'name' },
     ],
    }
  },
  methods: {
    opendialog(houseIndex){
      this.house = this.gothouses[houseIndex];
      this.houseIndex = houseIndex;

      this.dialog = true;
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
         <v-img
           height="200px"
           :src="\`../pictures/\${houseIndex}.png\`"
           :lazy-src="\`../pictures/\${houseIndex}.png\`"
         >
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
        :items="gothouses"
        hide-default-footer
        disable-pagination>
        <template slot="item" slot-scope="props">
          <tr @click="opendialog(props.index)">
             <td>{{ props.item.name }}</td>
             <td>
               <v-img
                  height="70px"
                  max-width="70px"
                  :src="\`../pictures/\${props.index}.png\`"
                  :lazy-src="\`../pictures/\${props.index}.png\`"
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
