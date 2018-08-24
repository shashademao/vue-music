<template>
  <div class="sliders">
    <div class="decorate"></div>
    <swiper :options="swiperOption">
      <swiper-slide v-for="(val, index) in slidersData" :key="index">
        <a :href="val.url">
          <img :src="val.picUrl">
        </a>
      </swiper-slide>
      <div class="swiper-pagination" slot="pagination"></div>
    </swiper>  
  </div>
  
</template>

<script>
  export default {
    name: 'carousel',
    data() {
      return {
        swiperOption: {
          loop:true,
          autoplay: true,
          pagination: {
            el: '.swiper-pagination',
          }
        },
      }
    },
    props:['slidersData']
  }
</script>
<style scoped lang='less'>
  .sliders{
    padding:7px;
    position:relateve;
    .decorate{
      position: absolute;
      top: -30vh;
      left:0;
      z-index: -10;
      background: #d44439;
      width: 100%;
      height: 50vh;
      vertical-align: inherit;
    }
    .swiper-container{
      margin: 0 auto;
      position: relative;
      overflow: hidden;
      list-style: none;
      padding: 0;
      z-index: 1;
      border-radius:6px;
    }
    .swiper-slide{
      img{
        width: 100%;
        vertical-align:bottom;
      }  
    }
    
  }
</style>