<template>
  <section class="app-main">
    <div class="main-box">
      <div v-if="flag == '2' & path" class="business-box">
        <div class="business-left-nav">
          <el-tree :data="routers" :indent="0" :props="defaultProps" :render-content="renderContent" @node-click="handleNodeClick">
            <span></span>
          </el-tree>
        </div>
      </div>
      <div :class="flag == '2' & path ? 'left-mar' : ''">
        <transition name="fade-transform" mode="out-in">
          <router-view :key="key" />
        </transition>
      </div>
    </div>
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
      defaultProps: {
        children: 'children',
        label: 'meta.title'
      },
    }
  },
  beforeMount() {
    this.flag = this.$store.getters.roles
  },
  beforeCreate() {
    this.flag = this.$store.getters.roles
  },
  watch: {
    $route(to,from){
      if ((to.path + '') === '/home' || (to.path + '') === '/home/home') {
        this.path = false
      } else {
        this.path = true
      }
      let q = to.path.indexOf("/")
      let w = to.path.indexOf("/", q + 1)
      if (to.path + '' !== '/home' && to.path + '' !== '/home/home') {
        if (w > -1) {
          this.routePath = to.path.substring(0, w)
        } else {
          this.routePath = to.path
        }
        console.log('获取到的路径：' +this.routePath)
        this.routers = []
        if (this.routePath != '/home') this.resetRouters(this.routePath)
      }
      this.flag = this.$store.getters.roles
    }
  },
  computed: {
    key() {
      return this.$route.path
    }
  },
  methods: {
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

.main-box {
  display: flex;
  flex-direction: row;
}
.left-mar {
  margin-left: 130px;
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
