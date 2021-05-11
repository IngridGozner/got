Vue.component('theme', {
  data: function () {
      return {
        title: 'Game Of Thrones',
      }
    },
  template:
  `  <v-app id="inspire">

    <v-app-bar app
    clipped-left
    color="#3F4045"
    >

    <v-img
       class="mr-3"
       src="../pictures/logo.png"
       lazy-src="../pictures/logo.png"
       max-height="55"
       max-width="50"
       contain
     ></v-img>

    <v-toolbar-title class="mr-12 align-center">
      <span style="color:#fbfbfb">{{ title }}</span>
    </v-toolbar-title>

    </v-app-bar>

  <v-main>
      <slot></slot>
  </v-main>
  </v-app>
  `
})
