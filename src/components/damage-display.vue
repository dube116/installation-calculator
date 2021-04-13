<template>
	<div class="row">
		<div class="col-sm-12">
            <emselect @update="enemy_changed"></emselect>
		</div>
		<div class="col-sm-12">
			<div class="row">
                <!--
                <template v-if="canDayAttack">
                    <damage-table v-bind:info="info" v-bind:type="dayAttackTypes[0]"/>
                </template> 
                -->
                <template v-for="(attackType, index) in dayAttackTypes" v-bind:key="index">
                    <template v-if="canDayAttack(index)">
                        <damage-table v-bind:info="info" v-bind:type="attackType"/>
                    </template> 
                </template>
                <template v-if="canNightAttack()">
                    <damage-table v-bind:info="info" v-bind:type="nightAttackType"/>
                </template>
			</div>
		</div>
		<div class="col-sm-6">
		</div>
		<div class="col-sm-12">
		</div>
	</div>
</template>
<script>
import emselect from './emselect.vue'
import damageTable from './damage-table.vue'

export default {
	data () {
		return {			
			dayAttackTypes:[
				{"id": 0, "text": "日戰 普通攻擊",  "day": true, pre: 1, post: 1, times: 1},
				{"id": 1, "text": "日戰 二連",  "day": true, pre: 1, post: 1.2, times: 2},
				{"id": 2, "text": "日戰 主砲觀測",  "day": true, pre: 1, post: 1.5, times: 1},
				{"id": 3, "text": "日戰 主徹觀測",  "day": true, pre: 1, post: 1.3, times: 1},
				{"id": 4, "text": "日戰 主電觀測",  "day": true, pre: 1, post: 1.2, times: 1},
				{"id": 5, "text": "日戰 主副觀測",  "day": true, pre: 1, post: 1.1, times: 1}
			],
            nightAttackType:{"id": 1000, "text": "夜戰", "day": false, pre: 1, post: 1},
			eq_id: [],
            landing_crafts_iist: [68, 166, 193, 230, 355],
            enemyInfo: {}
		}
	},
	props: ['shipInfo', 'fleetInfo'],
	components: {
        emselect,
		damageTable
	},
	computed: {
        'equipmentInfo' : function () {
            let re = {}
            let lcl = this.landing_crafts_iist
            re.has_type_3 = false
            re.has_AP = false
            re.has_radar = false
            re.has_seaplane = false
            re.has_spotplane = false
            re.has_DB = false
            
            re.WG42 = 0
            re.AGRL = 0
            re.AGRL_con = 0
            re.motar = 0
            re.motar_con = 0
            re.landing_crafts = 0
            re.landing_crafts_imp = 0
            re.toku = 0
            re.type_89 = 0
            re.tank_11th = 0
            re.M4A1 = 0
            re.type_2 = 0
            re.type_2_imp = 0
            
            re.main_gun = 0
            re.secd_gun = 0
            
            this.shipInfo.equipments.forEach(function(item){
                if(lcl.indexOf(item.id)!=-1){
                    re.landing_crafts++
                    re.landing_crafts_imp += parseInt(item.imp)
                    if(item.id == 68){
                        return;
                    }
                    else if(item.id == 166){
                        re.type_89++
                    }
                    else if(item.id == 193){
                        re.toku++
                    }
                    else if(item.id == 230){
                        re.tank_11th++
                    }
                    else if(item.id == 355){
                        re.M4A1++
                    }
                }
                else if(item.id == 167){
                    re.type_2++
                    re.type_2_imp += parseInt(item.imp)
                }
                else if(item.id == 35){
                    re.has_type_3 = true
                }
                else if(item.id == 36){
                    re.has_AP = true
                }                     
                else if(item.id == 10007){
                    re.has_radar = true
                }        
                else if(item.id == 10008){
                    re.has_seaplane = true
                }
                else if(item.id == 10009){
                    re.has_seaplane = true
                    re.has_spotplane = true
                }
                else if(item.id == 10010){
                    re.has_spotplane = true
                }
                else if(item.id == 126){
                    re.WG42++
                }
                else if(item.id == 346){
                    re.motar++
                }
                else if(item.id == 347){
                    re.motar_con++
                }
                else if(item.id == 348){
                    re.AGRL++
                }
                else if(item.id == 349){
                    re.AGRL_con++
                }
                else if(item.id == 10001||item.id == 10002||item.id == 10003){
                    re.main_gun++
                }
                else if(item.id == 10||item.id == 12||item.id == 10004){
                    re.secd_gun++
                }
            })
            return re
        },
        'info': function () {
            let re = {}
            re.enemy = this.enemyInfo
            re.fleet = this.fleetInfo
            re.ship = this.shipInfo
            re.eq = this.equipmentInfo
            return re
        }
	},
    methods: {
        'canDayAttack': function (index) {
            let day = !(this.fleetInfo.fleetType%2==0&&this.fleetInfo.fleetType!=0&&this.fleetInfo.enemyFleetType==1)
            if (index == 0) {
                return day
            }
            let common = day && this.equipmentInfo.has_spotplane
            if (index == 1) {
                return common && (this.equipmentInfo.main_gun > 1)
            }
            if (index == 2) {
                return common && (this.equipmentInfo.main_gun > 1) && this.equipmentInfo.has_AP
            }
            if (index == 3) {
                return common && (this.equipmentInfo.main_gun > 0) && (this.equipmentInfo.secd_gun > 0) && this.equipmentInfo.has_AP
            }
            if (index == 4) {
                return common && (this.equipmentInfo.main_gun > 0) && this.equipmentInfo.has_radar
            }
            if (index == 5) {
                return common && (this.equipmentInfo.main_gun > 0) && (this.equipmentInfo.secd_gun > 0)
            }
            return false
        },
        'canNightAttack': function () {
            return this.fleetInfo.fleetType%2==0
        },
        enemy_changed: function (val){
            this.enemyInfo = val
        }
    }
}
</script>
