<template>
  <div class="business-box">
    <div class="business-left-nav">
      <el-tree :data="routers" :indent="0" :props="defaultProps" :render-content="renderContent" @node-click="handleNodeClick">
        <span></span>
      </el-tree>
    </div>
  </div>
</template>

<script>
export default {
  name: 'info',
  beforeMount() {
    const routers = JSON.parse(JSON.stringify(this.$store.getters.routers))
    var resetRouter = []
    console.log(routers)
    routers.forEach(rts => {
      if (rts.path == '/student') {
        console.log('eeee')
        console.log(...rts.children)
        resetRouter.push(...rts.children)
      }
    });
    this.routers = resetRouter
  },
  data () {
    return {
      routers : [],
      defaultProps: {
        children: 'children',
        label: 'meta.title'
      },
    }
  },
  methods: {
    handleNodeClick(data) {
      console.log(data);
    },
    renderContent(h, { node, data }) {
      return (
        <span class="custom-tree-node">
          <span>{data.meta.title}</span>
        </span>
      );
     }
  }
}
</script>

<style scoped>
  .custom-tree-node span {
    font-size: 14px;
    color: #000000;
  }
</style>
