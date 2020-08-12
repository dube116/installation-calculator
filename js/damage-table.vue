<template>
	<div class="col-sm-12">
		<h4>{{ type.text }}</h4>
		<table class="table table-borderless damage-table"> 
			<thead>
				<tr>
					<th scope="col"></th>
					<th scope="col">小破以下</th>
					<th scope="col">　中破　</th>
					<th scope="col" v-if="type.id<1000">　大破　</th>
				</tr>
			</thead>
			<tbody>
                <template v-if="type.id<1000">
                    <template v-for="(t, i) in power_table">
                        <datr v-bind:power="t" v-bind:title="engage[i]" v-bind:enemy="settings.enemy.stat" v-bind:ammo="settings.ammo"></datr>
                    </template>
				</template>
				<template v-else>
                    <template v-for="(t2, k, i2) in power_table">
                        <datr v-bind:power="t2" v-bind:title="night_attck_type[k]" v-bind:enemy="settings.enemy.stat" v-bind:ammo="settings.ammo"></datr>
                    </template>
				</template>
			</tbody>
		</table>
	</div>
</template>
<script>
module.exports = {
	data () {
		return {
			engage: ["T有利", "同航", "反航", "T不利"],
            night_attck_type: ["普攻","二連"],
			landing_crafts_iist: [68, 166, 193, 230, 355],
			damaged_mul: [1, 0.7, 0.4],
			engage_mul: [1.2, 1.0, 0.8, 0.6]
		}
	},
	props: ['settings', 'type', 'fp'],
	components: {
		'datr': httpVueLoader('./damage-tr.vue')
	},
	computed: {
		'cap' : function() {
			if(this.type.day){
				return 180
			}
			else{
				return 300
			}
		},
		'power_table': function (){
			
			let eff = this.settings.enemy.effect
			let lcl = this.landing_crafts_iist
			let fp = this.fp
			let formation = this.settings.formation_mul
			
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
			
			let a13 = 1
			let b13 = 0
			let a6 = 1
            let a7 = 1
			let crafts_add = 0
			
			let has_type_3 = false
			let has_AP = false
			let has_radar = false
			let has_seaplane = false
            let has_DB = false
			
			let WG42 = 0
			let AGRL = 0
			let AGRL_con = 0
			let motar = 0
			let motar_con = 0
			let landing_crafts = 0
			let landing_crafts_imp = 0
			let toku = 0
			let type_89 = 0
			let tank_11th = 0
			let M4A1 = 0
			let type_2 = 0
			let type_2_imp = 0
            
            
			let main_gun = 0
			let secd_gun = 0
			
			this.settings.eqs.forEach(function(item, index, array){
				if(lcl.indexOf(item.id)!=-1){
					landing_crafts++
					landing_crafts_imp += parseInt(item.imp)
					if(item.id == 68){
						return;
					}
					else if(item.id == 166){
						type_89++
					}
					else if(item.id == 193){
						toku++
					}
					else if(item.id == 230){
						tank_11th++
					}
					else if(item.id == 355){
						M4A1++
					}
				}
				else if(item.id == 167){
					type_2++
					type_2_imp += parseInt(item.imp)
				}
                else if(item.id == 35){
					has_type_3 = true
				}
                else if(item.id == 36){
					has_AP = true
				}
                else if(item.id == 10008||item.id == 10009){
					has_seaplane = true
				}
                else if(item.id == 126){
					WG42++
				}
                else if(item.id == 346){
					motar++
				}
                else if(item.id == 347){
					motar_con++
				}
                else if(item.id == 348){
					AGRL++
				}
                else if(item.id == 349){
					AGRL_con++
				}
                else if(item.id == 10001||item.id == 10002||item.id == 10003){
					main_gun++
				}
                else if(item.id == 10||item.id == 12||item.id == 10004){
					secd_gun++
				}
                
			})
			if(landing_crafts>0){
				calc_a13(68, landing_crafts)
				calc_a6(68, landing_crafts)
				if(eff["land_craft_imp"]!=undefined){
					if(eff["land_craft_imp"].a13==true)
						a13 *= 1+landing_crafts_imp/landing_crafts/50
					if(eff["land_craft_imp"].a6==true)
						a6 *= 1+landing_crafts_imp/landing_crafts/50
				}
			}
			if(toku>0){
				calc_a13(193, toku)
				calc_a6(193, toku)
			}
			if(type_89>0){
				calc_a13(166, type_89)
				calc_a6(166, type_89)
			}
			if(tank_11th>0){
				calc_a13(230, tank_11th)
				calc_a6(230, tank_11th)
				calc_cr_a(230, tank_11th)
			}
			if(M4A1>0){
				calc_a13(355, M4A1)
				calc_a6(355, M4A1)
				calc_cr_a(355, M4A1)
			}
			if(type_2>0){
				calc_a13(167, type_2)
				calc_a6(167, type_2)
				if(eff["type_2_imp"]!=undefined){
					if(eff["type_2_imp"].a13==true)
						a13 *= 1+type_2_imp/type_2/30
					if(eff["type_2_imp"].a6==true)
						a6 *= 1+type_2_imp/type_2/30
				}
			}
            
			if(WG42>0){
				calc_a13(126, WG42)
				calc_a6(126, WG42)
				calc_b13(126, WG42)
			}
            
			if(motar>0 || motar_con>0){
				calc_a13(346, motar+motar_con)
				calc_a6(346, motar+motar_con)
				calc_b13(346, motar)
				calc_b13(347, motar_con)
			}
            
			if(AGRL>0 || AGRL_con>0){
				calc_a13(348, AGRL+AGRL_con)
				calc_a6(348, AGRL+motar_con)
				calc_b13(348, AGRL)
				calc_b13(349, AGRL_con)
			}
            if(has_type_3){
				calc_a13(35, 1)
			}
            if(has_AP){
				calc_a13(36, 1)
                if(main_gun>0){
                    if(secd_gun>0){
                        a7 = 1.15
                    }else if(has_radar){
                        a7 = 1.1
                    }
                    else{
                        a7 = 1.08
                    }
                }
			}
            if(has_seaplane){
				calc_a13(10008, 1)
			}
            
			if(eff.other!=undefined){
				if(eff.other.a6!=undefined){
					eff.other.a6.forEach(function(item, index, array){
						switch(item){
							case 0:
								//集積地 額外cap後 登陸艇改修補正
								if(type_89>0)
									a6*= 1+landing_crafts_imp/landing_crafts/50
						}
					})
				}
				if(eff.other.a13!=undefined){
				}
			}
			a13*= (M4A1>0?1.4:1)
			b13+= (M4A1>0?1.4:1)*crafts_add
			fp = fp*eff.a12[this.settings.ship_type]+eff.b12[this.settings.ship_type]
			fp = fp*a13+b13
			if(this.type.day){
				s = [[],[],[],[]]
				for(i = 0; i < 4; i++){
					for(j = 0; j < 3; j++){
						pre_cap = fp*formation*this.engage_mul[i]*this.damaged_mul[j]
						post_cap = pre_cap
						if(post_cap>this.cap){
							post_cap = this.cap + Math.sqrt(post_cap - this.cap)
						}
                        post_cap = Math.floor(post_cap*this.settings.post)
                        post_cap = Math.floor(post_cap*a6)
                        post_cap = Math.floor(post_cap*a7)
						s[i].push(post_cap)
					}
				}
			}
			else{
				s = {}
                s[0] = Array()
                for(i = 0; i < 2; i++){
                    pre_cap = fp*this.damaged_mul[i]
                    post_cap = pre_cap
                    if(post_cap>this.cap){
                        post_cap = this.cap + Math.sqrt(post_cap - this.cap)
                    }
                    post_cap = Math.floor(post_cap*this.settings.post)
                    post_cap = Math.floor(post_cap*a6)
                    s[0].push(post_cap)
                }
                if(main_gun+secd_gun>1&&(main_gun*0.9+secd_gun*0.2)<2){
                    s[1] = Array()
                    for(i = 0; i < 2; i++){
                        pre_cap = fp*this.damaged_mul[i]*1.2
                        post_cap = pre_cap
                        if(post_cap>this.cap){
                            post_cap = this.cap + Math.sqrt(post_cap - this.cap)
                        }
                        post_cap = Math.floor(post_cap*this.settings.post)
                        post_cap = Math.floor(post_cap*a6)
                        s[1].push(post_cap)
                    }
                }
			}
			return s
		}
	}
}
</script>