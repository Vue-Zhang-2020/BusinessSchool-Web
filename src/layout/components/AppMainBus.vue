<template>
  <section :class="flag == '2' ? 'app-mainBus' : 'app-main'">
    <transition name="fade-transform" mode="out-in">
      <router-view :key="key" />
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  data() {
    return {
      flag: '',
      path: false,
      routePath: '/home',
      routers : [],
      once: true,
      defaultProps: {
        children: 'children',
        label: 'meta.title'
      },
    }
  },
  beforeMount() {
    this.once = false
    let toPath = sessionStorage.getItem('pathTo')
    this.checkResetRouter(toPath)
    this.flag = this.$store.getters.roles
  },
  beforeCreate() {
    this.flag = this.$store.getters.roles
  },
  watch: {
    $route(to,from){
      sessionStorage.setItem('pathTo', to.path)
      this.$store.commit("SET_PATH_ROUTER", to.path);
      this.checkResetRouter(to.path + '')
      this.flag = this.$store.getters.roles
    }
  },
  computed: {
    key() {
      return this.$route.path
    }
  },
  mounted() {
    // this.listenPage()
  },
  methods: {
    listenPage() {
      window.onbeforeunload = function (e) {
        e = e || window.event;
        if (e) {
          e.returnValue = '关闭提示';
        }
        return '关闭提示';
      };
    },
    checkResetRouter(to) {
      // console.log(`传递过来:${to}`)
      if ((to + '') === '/home' || (to + '') === '/home/home') {
        this.path = false
      } else {
        this.path = true
      }
      let q = to.indexOf("/")
      let w = to.indexOf("/", q + 1)
      if (to + '' !== '/home' && to + '' !== '/home/home') {
        if (w > -1) {
          this.routePath = to.substring(0, w)
        } else {
          this.routePath = to
        }
        // console.log('获取到的路径：' +this.routePath)
        this.routers = []
        if (this.routePath != '/home') this.resetRouters(this.routePath)
      } 
    },
    handleNodeClick(data) {
      this.$router.push({ path: data.path })
    },
    renderContent(h, { node, data }) {
      return (
        <span class="custom-tree-node">
          <span>{data.meta.title}</span>
        </span>
      );
    },
    resetRouters(routerPath) {
      var routersList = JSON.parse(JSON.stringify(this.$store.getters.routers))
      routersList.forEach(rts => {
        if (rts.path == routerPath + '') {
          if (rts.children) {
            this.routers.push(...rts.children)
          }
        }
      });
    }
  }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
  background-color: #f2f3f7;
  padding: 16px;
}

.app-mainBus {
  /*50 = navbar  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
  background-color: #f2f3f7;
}

.main-box {
  display: flex;
  flex-direction: row;
}
.left-mar {
  width: 100%;
  margin-left: 156px;
}
.fixed-header+.app-main {
  padding-top: 50px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}

.app-main .sidebar-containerTwo {
  margin-top: 50px;
  margin-left: 145px;
  background-color: white !important;
}
</style>
