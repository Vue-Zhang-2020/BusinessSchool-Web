<template>
  <!-- <div class="business-box">
    <div class="business-left-nav">
      <el-tree :data="routers" :indent="0" :props="defaultProps" :render-content="renderContent" @node-click="handleNodeClick">
        <span></span>
      </el-tree>
    </div>
  </div> -->
  <div>asdasd</div>
</template>

<script>
export default {
  name: 'manager',
  beforeMount() {
    const routers = JSON.parse(JSON.stringify(this.$store.getters.routers))
    var resetRouter = []
    routers.forEach(rts => {
      if (rts.path == '/teaching') {
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
      // this.$router.push({ path: data.path })
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
