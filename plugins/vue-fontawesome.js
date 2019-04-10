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
  faImage,
  faTimes,
  faPlus
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
  faImage,
  faTimes,
  faPlus
)

Vue.component('font-awesome-icon', FontAwesomeIcon)
