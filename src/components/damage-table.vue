<template>
    <div class="col-xl-6">
        <h4>{{ type.text+(type.times>1?'('+type.times+'回攻擊)':'')+(type.post>1?'('+type.post+'倍攻擊)':'') }}</h4>
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
            engage: ["T有利", "同航", "反航", "T不利"],
            night_attck_type: [
                {
                    "text": "普攻", 
                    "times": 1
                },
                {
                    "text": "二連", 
                    "times": 2
                },
                {
                    "text": "主砲CI", 
                    "times": 1
                },
                {
                    "text": "主副CI", 
                    "times": 1
                }
            ],
            damaged_mul: [1, 0.7, 0.4],
            engage_mul: [1.2, 1.0, 0.8, 0.6]
        }
    },
    props: ['info', 'type'],
    components: {
        damageTr
    },
    computed: {
        'cap' : function() {
            if(this.type.day){
                return 220
            }
            else{
                return 360
            }
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
            
            let a13 = 1
            let b13 = 0
            let a6 = 1
            let a7 = 1
            let crafts_add = 0
            

            let calc_a13 = function(id, n){
                if(eff[id] == undefined) return
                if(eff[id].a13 == undefined) return
                while(n--){
                    a13*= eff[id].a13[n]
                }
            }
            let calc_b13 = function(id, n){
                if(eff[id] == undefined) return
                if(eff[id].b13 == undefined) return
                while(n--){
                    b13+= eff[id].b13[n]
                }
            }
            let calc_a6 = function(id, n){
                if(eff[id] == undefined) return
                if(eff[id].a6 == undefined) return
                while(n--){
                    a6*= eff[id].a6[n]
                }
            }
            let calc_cr_a = function(id, n){
                if(eff[id] == undefined) return
                if(eff[id].b13 == undefined) return
                while(n--){
                    crafts_add+= eff[id].b13[n]
                }
            }            
            let get_a12 = function(type){
                if(eff.a12 == undefined) return 1
                if(eff.a12[type] == undefined) return 1
                return eff.a12[type]
            }
            let get_b12 = function(type){
                if(eff.b12 == undefined) return 0
                if(eff.b12[type] == undefined) return 0
                return eff.b12[type]
            }

            if(eq.landing_crafts > 0){
                calc_a13(68, eq.landing_crafts)
                calc_a6(68, eq.landing_crafts)
                if(eff["land_craft_imp"] != undefined){
                    if(eff["land_craft_imp"].a13 == true)
                        a13 *= 1 + eq.landing_crafts_imp / eq.landing_crafts/ 50
                    if(eff["land_craft_imp"].a6 == true)
                        a6 *= 1 + eq.landing_crafts_imp / eq.landing_crafts / 50
                }
            }
            if(eq.toku > 0){
                calc_a13(193, eq.toku)
                calc_a6(193, eq.toku)
            }
            if(eq.type_89 > 0){
                calc_a13(166, eq.type_89)
                calc_a6(166, eq.type_89)
            }
            if(eq.tank_11th > 0){
                calc_a13(230, eq.tank_11th)
                calc_a6(230, eq.tank_11th)
                calc_cr_a(230, eq.tank_11th)
            }
            if(eq.M4A1 > 0){
                calc_a13(355, eq.M4A1)
                calc_a6(355, eq.M4A1)
                calc_cr_a(355, eq.M4A1)
            }
            if(eq.type_2 > 0){
                calc_a13(167, eq.type_2)
                calc_a6(167, eq.type_2)
                if(eff["type_2_imp"] != undefined){
                    if(eff["type_2_imp"].a13 == true)
                        a13 *= 1 + eq.type_2_imp / eq.type_2/ 30
                    if(eff["type_2_imp"].a6 == true)
                        a6 *= 1 + eq.type_2_imp / eq.type_2/ 30
                }
            }
            
            if(eq.WG42 > 0){
                calc_a13(126, eq.WG42)
                calc_a6(126, eq.WG42)
                calc_b13(126, eq.WG42)
            }
            
            if(eq.motar > 0 || eq.motar_con > 0){
                calc_a13(346, eq.motar + eq.motar_con)
                calc_a6(346, eq.motar + eq.motar_con)
                calc_b13(346, eq.motar)
                calc_b13(347, eq.motar_con)
            }
            
            if(eq.AGRL > 0 || eq.AGRL_con > 0){
                calc_a13(348, eq.AGRL + eq.AGRL_con)
                calc_a6(348, eq.AGRL + eq.AGRL_con)
                calc_b13(348, eq.AGRL)
                calc_b13(349, eq.AGRL_con)
            }
            if(eq.has_type_3){
                calc_a13(35, 1)
            }
            if(eq.has_AP){
                calc_a13(36, 1)
                if(eq.main_gun > 0){
                    if(eq.secd_gun > 0){
                        a7 = 1.15
                    }else if(eq.has_radar){
                        a7 = 1.1
                    }
                    else{
                        a7 = 1.08
                    }
                }
            }
            if(eq.has_seaplane){
                calc_a13(10008, 1)
            }
            
            if(eff.other!=undefined){
                if(eff.other.a6!=undefined){
                    eff.other.a6.forEach(function(item){
                        switch(item){
                            case 0:
                                //集積地 額外cap後 登陸艇改修補正
                                if(eq.type_89 > 0)
                                    a6*= 1 + eq.landing_crafts_imp / eq.landing_crafts/50
                        }
                    })
                }
                /*if(eff.other.a13!=undefined){
                }*/
            }
            a13*= (eq.M4A1 > 0 ? 1.4 : 1)
            b13+= (eq.M4A1 > 0 ? 1.4 : 1) * crafts_add
            fp = fp*get_a12(this.info.ship.shipType)+get_b12(this.info.ship.shipType)
            fp = fp*a13+b13
            let s
            if(this.type.day){
                s = [[],[],[],[]]
                for(let i = 0; i < 4; i++){
                    for(let j = 0; j < 3; j++){
                        let pre_cap = fp*formationMul*this.engage_mul[i]*this.damaged_mul[j]*this.type.pre
                        if(pre_cap>this.cap){
                            pre_cap = this.cap + Math.sqrt(pre_cap - this.cap)
                        }
                        let post_cap = Math.floor(pre_cap)
                        post_cap *= this.type.post
                        if (a7 != 1){
                            post_cap = Math.floor(post_cap*a7)
                        }
                        post_cap = post_cap*this.info.ship.post*a6
                        s[i].push(post_cap)
                    }
                }
            }
            else{
                s = []
                s.push({})
                s[0].arr = Array()
                s[0].type = 0
                for(let i = 0; i < 2; i++){
                    let pre_cap = fp*this.damaged_mul[i]
                    if (this.info.fleet.fleetFormation == 5) {
                        // 警戒陣
                        pre_cap*= formationMul
                    }
                    if(pre_cap>this.cap){
                        pre_cap = this.cap + Math.sqrt(pre_cap - this.cap)
                    }
                    let post_cap = Math.floor(pre_cap)
                    post_cap *= this.type.post
                    post_cap = post_cap*this.info.ship.post*a6
                    s[0].arr.push(post_cap)
                }
                if(eq.main_gun > 2){
                    s.push({})
                    s[s.length-1].arr = Array()
                    s[s.length-1].type = 2
                    for(let i = 0; i < 2; i++){
                        let pre_cap = fp*this.damaged_mul[i]*2
                        if (this.info.fleet.fleetFormation == 5) {
                            // 警戒陣
                            pre_cap*= formationMul
                        }
                        if(pre_cap>this.cap){
                            pre_cap = this.cap + Math.sqrt(pre_cap - this.cap)
                        }
                        let post_cap = Math.floor(pre_cap)
                        post_cap *= this.type.post
                        post_cap = post_cap*this.info.ship.post*a6
                        s[s.length-1].arr.push(post_cap)
                    }
                }
                else if(eq.main_gun > 1 && eq.secd_gun >0){
                    s.push({})
                    s[s.length-1].arr = Array()
                    s[s.length-1].type = 3
                    for(let i = 0; i < 2; i++){
                        let pre_cap = fp*this.damaged_mul[i]*1.75
                        if (this.info.fleet.fleetFormation == 5) {
                            // 警戒陣
                            pre_cap*= formationMul
                        }
                        if(pre_cap>this.cap){
                            pre_cap = this.cap + Math.sqrt(pre_cap - this.cap)
                        }
                        let post_cap = Math.floor(pre_cap)
                        post_cap *= this.type.post
                        post_cap = post_cap*this.info.ship.post*a6
                        s[s.length-1].arr.push(post_cap)
                    }
                }
                else if(eq.main_gun + eq.secd_gun > 1 && (eq.main_gun * 0.9 + eq.secd_gun * 0.2) < 2){
                    s.push({})
                    s[s.length-1].arr = Array()
                    s[s.length-1].type = 1
                    for(let i = 0; i < 2; i++){
                        let pre_cap = fp*this.damaged_mul[i]*1.2
                        if (this.info.fleet.fleetFormation == 5) {
                            // 警戒陣
                            pre_cap*= formationMul
                        }
                        if(pre_cap>this.cap){
                            pre_cap = this.cap + Math.sqrt(pre_cap - this.cap)
                        }
                        let post_cap = Math.floor(pre_cap)
                        post_cap *= this.type.post
                        post_cap = post_cap*this.info.ship.post*a6
                        s[s.length-1].arr.push(post_cap)
                    }
                }
            }
            return s
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