<template>
  <div :class="[{'has-logo':showLogo}, 'box-model']">
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
    <div class="login-bottom-box">
      <img src="../../../assets/tr_icon.png" width="94" height="24" alt="">
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes() {
      // return this.$router.options.routes
      const routes = JSON.parse(JSON.stringify(this.$store.getters.routers))
      var resetRouter = []
      routes.forEach(rts => {
        if (rts.children) {
          console.log(...rts.children)
          resetRouter.push(...rts.children)
        }
      });
      return resetRouter
      // return this.$store.getters.tRouters
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>

<style scoped>
  .box-model {
    position: relative;
  }

  .logo-box {
    width: 100%;
    padding-top: 26px;
    padding-bottom: 29px;
    border-bottom: 1px solid #282A52;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .logo-box .pro-name {
    margin-top: 8px;
    font-size: 14px;
    color: #FFFFFF;
  }

  .login-bottom-box {
    width: 100%;
    height: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    bottom: 0;
    left: 0;
    margin-bottom: 17px;
  }
</style>
