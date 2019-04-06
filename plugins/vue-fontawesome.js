import Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faHome,
  faSearch,
  faBell,
  faEnvelope,
  faFeather,
  faCog,
  faUser,
  faComment,
  faRetweet,
  faHeart,
  faShareAlt,
  faImage
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(
  faHome,
  faSearch,
  faBell,
  faEnvelope,
  faFeather,
  faCog,
  faUser,
  faComment,
  faRetweet,
  faHeart,
  faShareAlt,
  faImage
)

Vue.component('font-awesome-icon', FontAwesomeIcon)
