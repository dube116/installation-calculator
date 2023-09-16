<template>
    <div class="col-xl-6">
        <h4>{{ type.text+(type.times>1?'('+type.times+'回攻擊)':'')+(type.post>1?'('+type.post+'倍攻擊)':'') }}</h4>
        <h5 v-if="type.tips">{{ type.tips }}</h5>
        <template v-if="localtips.length > 0">
            <template v-for="(obj, index) in localtips" v-bind:key="index">
                <h5 >{{ obj }}</h5>
            </template>
        </template>
        <table class="table table-borderless damage-table"> 
            <thead>
                <tr>
                    <th scope="col"></th>
                    <th scope="col">小破以下</th>
                    <th scope="col">&emsp;中破&emsp;</th>
                    <th scope="col" v-if="type.id<1000">&emsp;大破&emsp;</th>
                </tr>
            </thead>
            <tbody>
                <template v-if="type.id<1000">
                    <template v-for="(arr, index) in power_table" v-bind:key="index">
                        <damage-tr v-bind:settings="info.settings" v-bind:ammo="info.ship.ammo" v-bind:day="type.day" v-bind:enemy="info.enemy.stat" v-bind:power="arr" v-bind:times="type.times" v-bind:title="engage[index]"/>
                    </template>
                </template>
                <template v-else>
                    <template v-for="(obj, index) in power_table" v-bind:key="index">
                        <damage-tr v-bind:settings="info.settings" v-bind:ammo="info.ship.ammo" v-bind:day="type.day" v-bind:enemy="info.enemy.stat" v-bind:power="obj.arr" v-bind:times="night_attck_type[obj.type].times" v-bind:title="night_attck_type[obj.type].text"/>
                    </template>
                </template>
            </tbody>
        </table>
    </div>
</template>

<script>
import damageTr from './damage-tr.vue'

export default {
    data () {
        return {
            dev: false,
            engage: ["T有利", "同航", "反航", "T不利"],
            night_attck_type: [
                { // 0
                    "text": "普攻", 
                    "times": 1
                },
                { // 1
                    "text": "二連", 
                    "times": 2
                },
                { // 2
                    "text": "砲雷CI", 
                    "times": 2
                },
                { // 3
                    "text": "雷CI", 
                    "times": 2
                },
                { // 4
                    "text": "主副CI", 
                    "times": 1
                },
                { // 5
                    "text": "主砲CI", 
                    "times": 1
                },
                { // 沒做
                    "text": "夜襲CI", 
                    "times": 1
                },
                { // 7
                    "text": "主魚電CI", 
                    "times": 1
                },
                { // 8
                    "text": "主魚電CI", 
                    "times": 2
                },
                { // 沒做
                    "text": "魚見電CI", 
                    "times": 1
                },
                { // 沒做
                    "text": "魚見電CI", 
                    "times": 2
                },
                { // 11
                    "text": "夜戰瑞雲CI",
                    "times": 1
                }
            ],
            damaged_mul: [1, 0.7, 0.4],
            engage_mul: [1.2, 1.0, 0.8, 0.6],
            add_bonus: {
                126: {"precap":[75, 35, 30, 20, 0, 0]},
                346: {"precap":[30, 25, 20, 15, 0, 0]},
                347: {"precap":[60, 50, 40, 30, 0, 0]},
                348: {"precap":[55, 60, 45, 30, 0, 0]},
                349: {"precap":[80, 90, 60, 30, 0, 0]}
            },
            land_craft_type: {
                "B": ['toku', 'panzerIII', 'panzerIIIJ'],
                "C": ['type_1', 'type_89', 'panzerIII', 'panzerIIIJ'],
                "DD": ['type_1', 'type_89', 'type_97', 'type_97_kai', 'panzerIII', 'panzerIIIJ'],
                "E": ['panzerII'],
                "FF": ['panzerII'],
                "G": ['soukoutei', 'armed'],
                "HH": ['soukoutei', 'armed'],
                "I": ['M4A1', 'type_97_kai', 'panzerIIIJ'],
                "J": ['tank_11th', 'type_1', 'panzerIII', 'panzerIIIJ'],
            }
        }
    },
    props: ['info', 'type'],
    components: {
        damageTr
    },
    computed: {
        'cap' : function() {
            if (this.type.day) {
                return 220
            }
            else{
                return 360
            }
        },
        'localtips': function (){
            const result = []
            let eq = this.info.eq

            if (!this.type.day) {
                // 主魚電CI
                if (this.info.ship.shipType == 0){
                    if (eq.main_gun > 0 && eq.torp > 0 && eq.has_radar){
                        result.push('主主魚電CI的電探需要索敵>=5')
                    }
                }
                // 夜戰瑞雲CI
                if (eq.main_gun > 1 && eq.night_seaplane > 0) {
                    result.push('夜戰瑞雲CI僅輕巡、航巡、航戰、水母可發動')
                    if (eq.has_radar) {
                        result.push('夜戰瑞雲CI的電探需要索敵>=5才會提高倍率')
                    }
                }
            }

            return result
        },
        'power_table': function (){
            let eff = this.info.enemy.effect
            let eq = this.info.eq
            if (eff === undefined || eq === undefined) {
                return
            }
            let fp
            if (this.type.day) {
                fp = this.info.ship.day_fp
            }
            else {
                fp = this.info.ship.night_fp
            }
            let formationMul = this.info.fleet.formationMul
            let precapMul = 1
            let precapAdd = 0
            let postcapMul = 1
            let APMul = 1
            
            let calc_precapMul = (id, n) => {
                if (eff?.[id]?.precap == undefined) return
                while (n--) {
                    if (this.dev){
                        console.log(id+ ' ' + n + ' ' + eff[id].precap[n] + 'x precap')
                    }
                    precapMul*= eff[id].precap[n]
                    precapMul = parseFloat(precapMul.toPrecision(15))
                }
            }
            let calc_postcap = (id, n) => {
                if (eff?.[id]?.postcap == undefined) return
                while(n--) {
                    if (this.dev){
                        console.log(id+ ' ' + n + ' ' + eff[id].postcap[n] + 'x postcap')
                    }
                    postcapMul*= eff[id].postcap[n]
                    postcapMul = parseFloat(postcapMul.toPrecision(15))
                }
            }
            let calc_precapAdd = (id, n) => {
                if (this.add_bonus?.[id]?.precap == undefined) return
                while (n--) {
                    precapAdd+= this.add_bonus[id].precap[n]
                }
            }
            
            let get_a12 = function(type) {
                if (eff?.a12?.[type] == undefined) return 1
                return eff.a12[type]
            }
            let get_b12 = function(type) {
                if (eff?.b12?.[type] == undefined) return 0
                return eff.b12[type]
            }

            fp = fp * get_a12(this.info.ship.shipType) + get_b12(this.info.ship.shipType)

            if (eq.has_type_3) {
                calc_precapMul(35, 1)
            }
            if (eq.has_AP) {
                calc_precapMul(36, 1)
                if (eq.main_gun > 0) {
                    if (eq.secd_gun > 0) {
                        APMul = 1.15
                    } else if (eq.has_radar) {
                        APMul = 1.1
                    } else {
                        APMul = 1.08
                    }
                }
            }
            if (eq.WG42 > 0) {
                calc_precapMul(126, eq.WG42)
                calc_postcap(126, eq.WG42)
            }
            if (eq.AGRL > 0 || eq.AGRL_con > 0) {
                calc_precapMul(348, eq.AGRL + eq.AGRL_con)
                calc_postcap(348, eq.AGRL + eq.AGRL_con)
            }
            if (eq.motar > 0 || eq.motar_con > 0) {
                calc_precapMul(346, eq.motar + eq.motar_con)
                calc_postcap(346, eq.motar + eq.motar_con)
            }
            if (eq.seaplane > 0) {
                calc_precapMul(10008, 1)
                calc_postcap(10008, 1)
            }
            if (eq.divebomber) {
                calc_precapMul(10011, eq.divebomber)
                calc_postcap(10011, eq.divebomber)
            }
            if (eq.type_2 > 0) {
                calc_precapMul(167, eq.type_2)
                calc_postcap(167, eq.type_2)
                if (eff["type_2_imp"] != undefined){
                    if (eff["type_2_imp"].precap == true)
                        precapMul *= 1 + eq.type_2_imp / eq.type_2 / 30
                        precapMul = parseFloat(precapMul.toPrecision(15))
                    if (eff["type_2_imp"].postcap == true)
                        postcapMul *= 1 + eq.type_2_imp / eq.type_2 / 30
                        postcapMul = parseFloat(postcapMul.toPrecision(15))
                }
            }
            // 登陸艇
            if (eq.landing_crafts_count > 0) {
                calc_precapMul('A', 1)
                calc_postcap('A', 1)
                if (eff["land_craft_imp"] != undefined) {
                    if (eff["land_craft_imp"].precap == true) {
                        precapMul *= 1 + eq.landing_crafts_imp / eq.landing_crafts_count / 50
                        precapMul = parseFloat(precapMul.toPrecision(15))
                    }
                    if (eff["land_craft_imp"].postcap == true) {
                        postcapMul *= 1 + eq.landing_crafts_imp / eq.landing_crafts_count / 50
                        postcapMul = parseFloat(postcapMul.toPrecision(15))
                    }
                }
            }
            for (const key in this.land_craft_type) {
                let count = 0
                this.land_craft_type[key].forEach(function(item){
                    count += eq[item]
                })
                if (count >= key.length) {
                    if ((key !== 'G' && key != 'HH') || this.type.day) {
                        calc_precapMul(key, 1)
                    }
                    calc_postcap(key, 1)
                }
            }
            
            if (eff.other!=undefined) {
                if (eff.other.postcap!=undefined) {
                    eff.other.postcap.forEach(function(item){
                        switch (item) {
                            case 0:
                                //集積地 額外cap後 登陸艇改修補正
                                if (eq.type_89 > 0)
                                    postcapMul*= 1 + eq.landing_crafts_imp / eq.landing_crafts_count / 50
                                    postcapMul = parseFloat(postcapMul.toPrecision(15))
                                if (eq.panzerII > 0)
                                    postcapMul*= 1 + eq.landing_crafts_imp / eq.landing_crafts_count / 50
                                    postcapMul = parseFloat(postcapMul.toPrecision(15))
                        }
                    })
                }
            }
            // 特殊登陸艇
            if (!this.info.torp) {
                if (eq.tank_11th > 0 || eq.type_1 > 0 || eq.panzerIII > 0 || eq.panzerIIIJ > 0) {
                    precapMul *= 1.8
                    precapAdd += 25
                }
                if (eq.M4A1 > 0) {
                    precapMul *= 1.4
                    precapAdd *= 1.4
                    precapAdd += 35
                }
                if (eq.type_1 > 0 ) {
                    precapMul *= 1.3
                    precapAdd *= 1.3
                    precapAdd += 42
                }
                if (eq.type_97 > 0 ) {
                    precapMul *= 1.4
                    precapAdd *= 1.4
                    precapAdd += 28
                }
                if (eq.type_97_kai > 0 ) {
                    precapMul *= 1.5
                    precapAdd *= 1.5
                    precapAdd += 33
                }
            }
            // 登陸艇套裝
            if (!this.info.torp) {
                let A = eq.armed
                let B = eq.soukoutei
                let C = eq.daihatsu + eq.toku + eq.type_89 + eq.panzerII + eq.type_1
                let D = eq.tank_11th + eq.type_2 + eq.type_97 + eq.type_97_kai + eq.panzerIII
                
                if (A + B == 1 && C + D > 0) {
                    precapMul *= 1.2
                    precapAdd *= 1.2
                    precapAdd += 10
                } else if (A > 0 && B > 0 && C == 1 && D == 0) {
                    precapMul *= 1.3
                    precapAdd *= 1.3
                    precapAdd += 15
                } else if (A > 0 && B > 0 && C == 0 && D == 1) {
                    precapMul *= 1.4
                    precapAdd *= 1.4
                    precapAdd += 20
                } else if (A > 0 && B > 0 && C + D > 1) {
                    precapMul *= 1.5
                    precapAdd *= 1.5
                    precapAdd += 25
                }
            }
            
            if (eq.WG42 > 0) {
                calc_precapAdd(126, eq.WG42)
            }
            if (eq.AGRL > 0) {
                calc_precapAdd(348, eq.AGRL)
            }
            if (eq.AGRL_con > 0) {
                calc_precapAdd(349, eq.AGRL_con)
            }
            if (eq.motar > 0) {
                calc_precapAdd(346, eq.motar)
            }
            if (eq.motar_con > 0) {
                calc_precapAdd(347, eq.motar_con)
            }

            if (this.dev) {
                console.log('fp: ' + fp)
                console.log('final precap: x' + precapMul + ' +' + precapAdd)
                console.log('final postcap: x' + postcapMul)
            }
            fp *= precapMul
            fp += precapAdd

            let result
            if (this.type.day){
                result = [[],[],[],[]]
                for(let i = 0; i < 4; i++){
                    for(let j = 0; j < 3; j++){
                        let precapFirePower = fp*formationMul*this.engage_mul[i]*this.damaged_mul[j]*this.type.pre
                        if (precapFirePower>this.cap){
                            precapFirePower = this.cap + Math.sqrt(precapFirePower - this.cap)
                        }
                        let postcapFirePower = Math.floor(precapFirePower)
                        postcapFirePower *= this.type.post
                        if (APMul != 1){
                            postcapFirePower = Math.floor(postcapFirePower*APMul)
                        }
                        postcapFirePower *= this.info.ship.post*postcapMul
                        postcapFirePower += Number.parseInt(this.info.ship.postAdd)
                        result[i].push(postcapFirePower)
                    }
                }
            }
            else{
                result = []
                if (result !== undefined) {
                    // 平A
                    result.push({})
                    result[0].type = 0
                    result[0].arr = this.getNightAttackArr(fp, postcapMul, 1)
                }
                if (eq.main_gun > 2){
                    // 主砲CI
                    result.push({})
                    result[result.length-1].type = 5
                    result[result.length-1].arr = this.getNightAttackArr(fp, postcapMul, 2)
                }
                else if (eq.main_gun > 1 && eq.secd_gun > 0){
                    // 主副CI
                    result.push({})
                    result[result.length-1].type = 4
                    result[result.length-1].arr = this.getNightAttackArr(fp, postcapMul, 1.75)
                }
                else if (eq.torp > 1 && this.info.torp){
                    // 雷CI
                    result.push({})
                    result[result.length-1].type = 3
                    result[result.length-1].arr = this.getNightAttackArr(fp, postcapMul, 1.5)
                }
                else if (eq.torp > 1 && this.info.torp){
                    // 砲雷CI
                    result.push({})
                    result[result.length-1].type = 2
                    result[result.length-1].arr = this.getNightAttackArr(fp, postcapMul, 1.3)
                }
                else if (eq.main_gun + eq.secd_gun > 1 && (eq.main_gun * 0.9 + eq.secd_gun * 0.2) < 2){
                    // 二連
                    result.push({})
                    result[result.length-1].type = 1
                    result[result.length-1].arr = this.getNightAttackArr(fp, postcapMul, 1.2)
                }
                // DD特殊CI 只做主魚電
                if (this.info.ship.shipType == 0){
                    if (eq.main_gun > 0 && eq.torp > 0 && eq.has_radar){
                        // 主魚電CI
                        let mul = 1.3
                        if (eq.gun_d2 + eq.gun_d3 > 1) {
                            mul *= 1.4
                        } else if (eq.gun_d2 + eq.gun_d3 > 0) {
                            mul *= 1.25
                        }
                        if (eq.gun_d3 > 1) {
                            mul *= 1.1
                        } else if (eq.gun_d3 > 0) {
                            mul *= 1.05
                        }
                        result.push({})
                        result[result.length-1].type = 7
                        result[result.length-1].arr = this.getNightAttackArr(fp, postcapMul, mul)
                        result.push({})
                        result[result.length-1].type = 8
                        result[result.length-1].arr = this.getNightAttackArr(fp, postcapMul, mul)
                    }
                }
                // 夜戰瑞雲CI
                if (eq.main_gun > 1 && eq.night_seaplane > 0) {
                    let mul = 1.24
                    if (eq.has_radar) {
                        mul += 0.04
                    }
                    if (eq.night_seaplane > 1) {
                        mul += 0.08
                    }
                    result.push({})
                    result[result.length-1].type = 11
                    result[result.length-1].arr = this.getNightAttackArr(fp, postcapMul, mul)
                }
            }
            return result
        }
    },
    methods: {
        'getNightAttackArr': function(fp, postcapMul, attackTypeMul) {
            const result = Array()
            for(let i = 0; i < 2; i++){
                let precapFirePower = fp*this.damaged_mul[i]*attackTypeMul
                if (this.info.fleet.fleetFormation == 5) {
                    // 警戒陣
                    precapFirePower*= this.info.fleet.formationMul
                }
                if (precapFirePower > this.cap){
                    precapFirePower = this.cap + Math.sqrt(precapFirePower - this.cap)
                }
                let postcapFirePower = Math.floor(precapFirePower)
                postcapFirePower *= this.type.post
                postcapFirePower *= this.info.ship.post*postcapMul
                postcapFirePower += Number.parseInt(this.info.ship.postAdd)
                result.push(postcapFirePower)
            }
            return result
        }
    }
}
</script>

<style>
.damage-table{
	text-align: center;
    width: auto;
}
</style>