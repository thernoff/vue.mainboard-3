<template>
  <div class="mainboard-system-clock">
    <div class="mainboard-system-clock__container">
      <div class="mainboard-system-clock__time">{{ time }}</div>
      <div class="mainboard-system-clock__date">{{ date }}</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      time: "",
      date: ""
    };
  },
  created() {
    this.time = this.getTime();
    this.date = this.getDate();
    this.updateTime();
  },
  methods: {
    getTime() {
      var now = new Date();
      var hours = now.getHours() < 10 ? "0" + now.getHours() : now.getHours();
      var minutes =
        now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes();
      var seconds =
        now.getSeconds() < 10 ? "0" + now.getSeconds() : now.getSeconds();

      return hours + ":" + minutes;
    },

    getDate() {
      var now = new Date();
      var year = now.getFullYear();
      var month = now.getMonth() < 10 ? "0" + now.getMonth() : now.getMonth();
      var day = now.getDate() < 10 ? "0" + now.getDate() : now.getDate();

      return day + "." + month + "." + year;
    },
    updateTime() {
      //let time = new Date.getTime();
      setInterval(() => {
        this.time = this.getTime();
        this.date = this.getDate();
      }, 1000);
    }
  }
};
</script>

<style scoped>
.mainboard-system-clock {
  height: 100%;
  text-align: center;
  font-size: 12px;
}

.mainboard-system-clock__container {
  padding: 0px 10px;
  /* border-right: 2px solid rgb(41, 60, 86, 0.6);
  border-left: 2px solid rgb(41, 60, 86, 0.6); */
}
</style>
