<template>
	<div class="row">
		<div class="col-sm-12">
            <emselect @update="enemyChanged"></emselect>
            <color-select @update="colorChanged"/>
		</div>
		<div class="col-sm-12">
			<div class="row">
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
import colorSelect from './color-select.vue'
import emselect from './emselect.vue'
import damageTable from './damage-table.vue'

export default {
	data () {
		return {
            settings: {
                colorMode: 0,
            },           	
			dayAttackTypes:[
				{"id": 0, "text": "日戰 普通攻擊",  "day": true, pre: 1, post: 1, times: 1},
				{"id": 1, "text": "日戰 二連",  "day": true, pre: 1, post: 1.2, times: 2},
				{"id": 2, "text": "日戰 主砲觀測",  "day": true, pre: 1, post: 1.5, times: 1},
				{"id": 3, "text": "日戰 主徹觀測",  "day": true, pre: 1, post: 1.3, times: 1},
				{"id": 4, "text": "日戰 主電觀測",  "day": true, pre: 1, post: 1.2, times: 1},
				{"id": 5, "text": "日戰 主副觀測",  "day": true, pre: 1, post: 1.1, times: 1},
				{"id": 6, "text": "日戰 瑞雲立體",  "day": true, pre: 1, post: 1.35, times: 1, tips:"僅伊勢級改二+瑞雲可發動"},
				{"id": 7, "text": "日戰 海空立體",  "day": true, pre: 1, post: 1.3, times: 1, tips:"僅伊勢級改二+六三四空艦爆可發動"}
			],
            nightAttackType:{"id": 1000, "text": "夜戰", "day": false, pre: 1, post: 1},
			eq_id: [],
            landing_crafts_iist: [68, 166, 193, 230, 355, 408, 409, 436, 449, 482],
            enemyInfo: {}
		}
	},
	props: ['shipInfo', 'fleetInfo', 'enableTorp'],
	components: {
        colorSelect,
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
            re.has_spotplane = false
            
            re.WG42 = 0
            re.AGRL = 0
            re.AGRL_con = 0
            re.motar = 0
            re.motar_con = 0
            re.seaplane = 0
            re.DB = 0
            
            re.landing_crafts = 0
            re.landing_crafts_imp = 0
            re.daihatsu = 0
            re.toku = 0
            re.type_89 = 0
            re.tank_11th = 0
            re.M4A1 = 0
            re.soukoutei = 0
            re.armed = 0
            re.panzerII = 0
            re.panzerIII = 0
            re.type_1 = 0
            re.type_2 = 0
            re.type_2_imp = 0
            
            re.main_gun = 0
            re.secd_gun = 0
            re.torp = 0
            
            this.shipInfo.equipments.forEach(function(item){
                if(lcl.indexOf(item.id)!=-1){
                    re.landing_crafts++
                    re.landing_crafts_imp += parseInt(item.imp)
                    if(item.id == 68){
                        re.daihatsu++
                        return
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
                    else if(item.id == 408){
                        re.soukoutei++
                    }
                    else if(item.id == 409){
                        re.armed++
                    }
                    else if(item.id == 436){
                        re.panzerII++
                    }
                    else if(item.id == 449){
                        re.type_89++
                        re.type_1++
                        re.tank_11th++
                    }
                    else if(item.id == 482){
                        re.panzerIII++
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
                    re.seaplane++
                }
                else if(item.id == 10009){
                    re.seaplane++
                    re.has_spotplane = true
                }
                else if(item.id == 10010){
                    re.has_spotplane = true
                }
                else if(item.id == 10011){
                    re.DB++
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
                else if(item.id == 10005){
                    re.torp++
                }
            })
            return re
        },
        'info': function () {
            let re = {}
            re.torp = this.enemyInfo.enableTorp
            re.enemy = this.enemyInfo
            re.eq = this.equipmentInfo
            re.fleet = this.fleetInfo
            re.ship = this.shipInfo
            re.settings = this.settings
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
            if (index == 6) {
                return day && (this.equipmentInfo.main_gun > 0) && (this.equipmentInfo.seaplane > 1)
            }
            if (index == 7) {
                return day && (this.equipmentInfo.main_gun > 0) && (this.equipmentInfo.DB > 1) && (this.equipmentInfo.seaplane < 2)
            }
            return false
        },
        'canNightAttack': function () {
            return this.fleetInfo.fleetType%2==0
        },
        'colorChanged': function (val){
            this.settings.colorMode = val
        },
        'enemyChanged': function (val){
            this.enemyInfo = val
            this.$emit('enemyChanged', val)
        }
    }
}
</script>
