<template>
    <div>
        <div class="input-group">
            <div class="input-group-prepend">
                <span class="input-group-text">艦種</span>
            </div>
            <select class="form-control" v-model="shipInfo.shipType">
                <option v-for="s in shipTypes" v-bind:value="s.val" v-bind:key="s.id">
                    {{ s.text }}
                </option>
            </select>
        </div>
        <div class="input-group">
            <div class="input-group-prepend">
                <span class="input-group-text">面板火力</span>
            </div>
            <input type="number" class="form-control" max="999" v-model="base_fp">
        </div>
        <div class="input-group" v-if="enableTorp">
            <div class="input-group-prepend">
                <span class="input-group-text">面板雷裝</span>
            </div>
            <input type="number" class="form-control" max="999" v-model="torp">
        </div>
        <div class="input-group" v-if="!(fleetInfo.fleetType%2==0&&fleetInfo.fleetType!=0&&fleetInfo.enemyFleetType==1)">
            <div class="input-group-prepend">
                <span class="input-group-text">基本攻擊力(日)</span>
            </div>
            <input type="number" class="form-control" disabled v-model="day_fp_display">
        </div>
        <div class="input-group" v-if="fleetInfo.fleetType%2==0">
            <div class="input-group-prepend">
                <span class="input-group-text">基本攻擊力(夜)</span>
            </div>
            <input type="number" class="form-control" disabled v-model="night_fp_display">
        </div>
        <div class="input-group">
            <div class="input-group-prepend">
                <span class="input-group-text">當前彈藥</span>
            </div>
            <input type="number" class="form-control" max="999" v-model="now_ammo" v-on:change="AmmoChange">
        </div>
        <div class="input-group">
            <div class="input-group-prepend">
                <span class="input-group-text">最大彈藥</span>
            </div>
            <input type="number" class="form-control" max="999" v-model="max_ammo" v-on:change="AmmoChange">
        </div>
        <div class="input-group">
            <div class="input-group-prepend">
                <span class="input-group-text">cap後倍率</span>
            </div>
            <input type="number" class="form-control" min="1" max="999" step="0.01" title="戰艦特攻、倍卡、削甲乘算" v-model="shipInfo.post">
        </div><div class="input-group">
            <div class="input-group-prepend">
                <span class="input-group-text">cap後加算</span>
            </div>
            <input type="number" class="form-control" min="0" max="999" title="削甲加算" v-model="shipInfo.postAdd">
        </div><br>
        <eqselect v-for="n in 6" @update="eqChanged" v-bind:key="n" v-bind:ord="n"></eqselect>
    <br>
    </div>
</template>

<script>
import eqselect from './eqselect.vue'
export default {
	data () {
		return {
            eqlist: {
                id: [9999,68,166,436,193,230,449,482,514,494,495,355,408,409,167,35,36,126,348,349,346,347,10001,267,366,10002,10003,10,12,10004,10005,41,10006,10007,10008,10009,490,10010,10011,10012,10013,10014,10015,129,0],
                fac: [[0,0],[1,1],[1,1],[0,0],[1,1],[1,1],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[1,1],[1,1],[1,1],[1,1],[1,1],[0,0],[1,1],[0,0],[0.75,0],[0.75,0],[1,1],[1,1],[1,1],[1,1],[1.5,1],[0.2,0.2],[0.3,0.3],[1,1],[0,1],[0,1],[1,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0.75,0],[0.75,0],[1,1],[1,1],[1,1],[0,0]]
            },	
            fleetTypes: [
                {text: "單艦隊", add: [0, 5]},
                {text: "空母機動部隊 第一艦隊", add: [2, 2]},
                {text: "空母機動部隊 第二艦隊", add: [10, -5]},
                {text: "水上打擊部隊 第一艦隊", add: [10, 2]},
                {text: "水上打擊部隊 第二艦隊", add: [-5, -5]},
                {text: "輸送護衛部隊 第一艦隊", add: [-5, -5]},
                {text: "輸送護衛部隊 第二艦隊", add: [10, -5]}
            ],
            shipTypes: [
                {text: "DD", val: 0},
                {text: "CL", val: 1},
                {text: "SS(V)", val: 2},
                {text: "其他", val: 99}
            ],
            base_fp: 10,
            torp: 0,
            max_ammo : 20,
            now_ammo : 20,
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
                postAdd: 0,
                shipType: 0
            }
		}
	},
	components: {
		eqselect
	},
	computed: {
		day_fp_display: function () {
			return Math.floor(this.shipInfo.day_fp)
		},
		night_fp_display: function () {
			return Math.floor(this.shipInfo.night_fp)
		}
    },
	methods: {
		AmmoChange: function () {          
            this.shipInfo.ammo = this.now_ammo*2/this.max_ammo
            if(this.shipInfo.ammo>1){
                this.shipInfo.ammo = 1
            }  
		},
        fpCalc: function(){
            const eqlist = this.eqlist
			let dfp = parseInt(this.base_fp)+5
			let nfp = parseInt(this.base_fp)
            if (this.enableTorp) {
                nfp += parseInt(this.torp)
            }
			dfp += this.fleetTypes[this.fleetInfo.fleetType].add[this.fleetInfo.enemyFleetType?1:0]
			this.shipInfo.equipments.forEach(function(item){
				let id = eqlist.id.indexOf(item.id)
				if(item.id == 10 ||item.id == 12){
					dfp += eqlist.fac[id][0]*parseInt(item.imp)
					nfp += eqlist.fac[id][1]*parseInt(item.imp)
				}
				else{
					dfp += eqlist.fac[id][0]*Math.sqrt(parseInt(item.imp))
					nfp += eqlist.fac[id][1]*Math.sqrt(parseInt(item.imp))
				}
			})
            this.shipInfo.day_fp = dfp
            this.shipInfo.night_fp = nfp
        },
        eqChanged: function (ord, id, imp){
            this.shipInfo.equipments[ord-1].id = id
            this.shipInfo.equipments[ord-1].imp = imp
            this.fpCalc()
            this.$emit('update', this.shipInfo)
        }
	},
	props: ['fleetInfo', 'enableTorp'],
    watch: {
        'base_fp': function (){
            this.fpCalc()
            this.$emit('update', this.shipInfo)
        },
        'torp': function (){
            this.fpCalc()
            this.$emit('update', this.shipInfo)
        },
        'enableTorp': function (){
            this.fpCalc()
            this.$emit('update', this.shipInfo)
        },
        'fleetInfo.fleetType': {
            handler: function (){
                this.fpCalc()
                this.$emit('update', this.shipInfo)
            },
            immediate: true            
        },
        'fleetInfo.enemyFleetType': {
            handler: function (){
                this.fpCalc()
                this.$emit('update', this.shipInfo)
            },
            immediate: true            
        },
        'shipInfo.ammo': function (){
            this.$emit('update', this.shipInfo)
        },
        'shipInfo.shipType': function (){
            this.$emit('update', this.shipInfo)
        },
        'shipInfo.post': function (){
            this.$emit('update', this.shipInfo)
        },
        'shipInfo.postAdd': function (){
            this.$emit('update', this.shipInfo)
        },
    }
}
</script>