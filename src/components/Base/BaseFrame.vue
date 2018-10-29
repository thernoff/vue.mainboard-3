<template>
  <div class="mainboard-frame">
    <div class="mainboard-frame__cover"/>
    <iframe 
      ref="baseFrame" 
      :src="src" 
      class="mainboard-frame__frame" 
      frameborder="0" 
      @load="load"/>
  </div>
</template>

<script>
export default {
  props: ["apiLink", "backLink"],
  data() {
    return {
      cover: false
    };
  },

  data() {
    return {
      src: this.apiLink,
      firstLoad: true
    };
  },

  watch: {
    backLink(newVal, oldVal) {
      console.log("newVal", newVal);
      console.log("oldVal", oldVal);
      if (newVal) {
        this.$refs.baseFrame.src = newVal;
      }
    }
  },

  methods: {
    load() {
      console.log("Load frame first");
      if (!this.firstLoad) {
        console.log(
          "Load frame",
          this.$refs.baseFrame.contentWindow.document.title
        );
        let apiLink = "";
        const currentLink = this.$refs.baseFrame.contentWindow.location.href;
        const posRedirurl = this.apiLink.search(/redirurl/i);

        if (posRedirurl > 0) {
          let subApiLink = this.apiLink.slice(0, posRedirurl);
          let newRedirurl = btoa(currentLink);
          newRedirurl = newRedirurl.replace(/\+/g, "-");
          newRedirurl = newRedirurl.replace(/\//g, "_");
          newRedirurl = newRedirurl.replace(/=/g, ",");
          apiLink = subApiLink + "redirurl=" + newRedirurl;
        }
        const data = {
          title: this.$refs.baseFrame.contentWindow.document.title,
          apiLink,
          currentLink
        };

        this.$emit("loadFrame", data);
      } else {
        this.firstLoad = false;
      }
    }
  }

  /*   created() {
    console.log("created", this);
    console.log("created", this.$refs);
    console.log("created", this.$refs["baseFrame"]);
  },

  mounted() {
    console.log("mounted", this);
    console.log("mounted", this.$refs);
    console.log("mounted", this.$refs["baseFrame"]);
    //this.$refs.baseFrame.src = this.frameSrc
  },

  beforeUpdate() {
    console.log("beforeUpdate", this.$refs.baseFrame);
    this.$refs.baseFrame.src = "";
  },

  updated() {
    console.log("updated", this);
    console.log("updated", this.$refs);
    console.log("updated", this.$refs["baseFrame"]);
    this.$refs.baseFrame.src = this.frameSrc;
  } */
};
</script>

<style scoped>
.mainboard-frame {
  position: relative;
  width: 100%;
  height: 100%;
}

.mainboard-frame__frame {
  width: 100%;
  height: 100%;
}

.mainboard-frame__cover {
  display: none;
  width: 100%;
  height: 100%;
  z-index: 500;
  position: absolute;
  left: 0px;
  top: 0px;
  /* right: 0px;
        bottom: 0px; */
  overflow: hidden;
}
</style>
