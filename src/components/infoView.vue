<template>
    <div id="infoview">
        <div class="infolist">
            <info-list></info-list>
        </div>
        <div class="infodetail">
            <info-detail></info-detail>
        </div>
    </div>
</template>

<script>
import InfoList from '../components/infoView/infoList';
import InfoDetail from '../components/infoView//infoDetail';
export default {
    components:{
        InfoList,
        InfoDetail
    }
}
</script>


<style lang="scss" scoped>
#infoview {
    display: flex;
    width: 100%;
    height: 100%;
    .infolist{
        width: 260px;
        height: 100%;
        background-color: #FFFFFF;
        border-right: 1px solid #F0F0F0;
    }
    .infodetail{
        width:450px;
        height: 100%;
        background-color: #FFFFFF;
        flex-grow: 1;
    }
}
</style>

