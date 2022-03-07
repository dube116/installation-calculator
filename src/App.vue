<template>
	<div class="container-fluid">
        <h4>艦これ 試製對陸計算機一號乙型改七</h4>
        <div class="row">
            <div class="col-md-3">
                <shipData @update="shipChanged" v-bind:fleetInfo="fleetInfo"></shipData>
                <fleetData @update="fleetChanged"></fleetData>
                <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#future">
                    更新紀錄
                </button>
            </div>     
            <div class="col-md-9">
                <damageDisplay v-bind:shipInfo="shipInfo" v-bind:fleetInfo="fleetInfo"/>
            </div>
        </div>   
    </div>
</template>

<script>
import damageDisplay from './components/damage-display.vue'
import fleetData from './components/fleet-data.vue'
import shipData from './components/ship-data.vue'

export default {
	data () {
		return {
			fleetInfo: {
                fleetType: 0,
                enemyFleetType: 0,
                fleetFormation: 0,
                formationMul: 1
            },
            shipInfo: {
                ammo: 1,
                day_fp: 15,
                night_fp: 10,
                equipments: [
                    {ord: 1, id: 0, imp: 0},
                    {ord: 2, id: 0, imp: 0},
                    {ord: 3, id: 0, imp: 0},
                    {ord: 4, id: 0, imp: 0},
                    {ord: 5, id: 0, imp: 0},
                    {ord: 6, id: 0, imp: 0}
                ],
                post: 1,
                shipType: 0
            }
		}
	},            
    components: {
        shipData,
        damageDisplay,
        fleetData
    },
    methods: {
        fleetChanged: function (val){
            this.fleetInfo = val
        },
        shipChanged: function (val){
            this.shipInfo = val
        }
    }
}
</script>

<style>
body {
	background-color: #EEE;
	font-family: 微軟正黑體;
}
</style>
