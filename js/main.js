new Vue({
	el: '#app',
	data: {
		message: 'Hello Vue.js!',
		message2: 'Hello Vue.js2!',
		eqs: [
			{ord: 1, id: 0, imp: 0},
			{ord: 2, id: 0, imp: 0},
			{ord: 3, id: 0, imp: 0},
			{ord: 4, id: 0, imp: 0},
			{ord: 5, id: 0, imp: 0},
			{ord: 6, id: 0, imp: 0}
		],
		eqlist: {
			id: [9999,68,166,193,230,355,167,35,36,126,346,347,348,349,10001,10002,10003,10,12,10004,10005,10006,10007,10008,10009,10010,10011,10012,10013,10014,0],
			fac: [[0,0],[1,1],[1,1],[1,1],[0,0],[0,0],[1,1],[1,1],[1,1],[0,0],[0.75,0],[0.75,0],[1,1],[1,1],[1,1],[1,1],[1.5,1],[0.2,0.2],[0.3,0.3],[1,1],[0,1],[1,0],[0,0],[0,0],[0,0],[0,0],[0.75,0],[0.75,0],[1,1],[1,1],[0,0]]
		},
		fleet_types: [
			{text: "單艦隊", val: 0, add: [0, 5]},
			{text: "空母機動部隊 第一艦隊", val: 1, add: [2, 2]},
			{text: "空母機動部隊 第二艦隊", val: 2, add: [10, -5]},
			{text: "水上打擊部隊 第一艦隊", val: 3, add: [10, 2]},
			{text: "水上打擊部隊 第二艦隊", val: 4, add: [-5, -5]},
			{text: "輸送護衛部隊 第一艦隊", val: 5, add: [-5, -5]},
			{text: "輸送護衛部隊 第二艦隊", val: 6, add: [10, -5]}
		],
		enemy_fleet_types: [
			{text: "單艦隊", val: 0},
			{text: "聯合艦隊 第一艦隊", val: 1},
			{text: "聯合艦隊 第二艦隊", val: 2}
		],
		fleet_formations: [
			{text: "單縱陣", val: 0, mul: 1},
			{text: "複縱陣", val: 1, mul: 0.8},
			{text: "輪型陣", val: 2, mul: 0.7},
			{text: "梯形陣", val: 3, mul: 0.75},
			{text: "單橫陣", val: 4, mul: 0.6},
			{text: "警戒陣(前)", val: 5, mul: 0.5},
			{text: "警戒陣(後)", val: 6, mul: 1},
		],
		combined_fleet_formations: [
			{text: "第一警戒", val: 10, mul: 0.8},
			{text: "第二警戒", val: 11, mul: 1},
			{text: "第三警戒", val: 12, mul: 0.7},
			{text: "第四警戒", val: 13, mul: 1.1},
		],
		settings: {
			ship_type: 0,
			fleet_type: 0,
			enemy_fleet_type: 0,
			fleet_formation: 0
		},
		base_fp: 10,
		post: 1,
        max_ammo : 20,
        now_ammo : 20
	},
	components: {
		'eqselect': httpVueLoader('./js/eqselect.vue'),
		'dadi': httpVueLoader('./js/damage-display.vue')
	},
	methods: {
		ftype_change: function (event) {
			if(this.settings.fleet_type==0){
				
				this.settings.fleet_formation = 0;
			}
			else{
				this.settings.fleet_formation = 13;
			}
		}
	},
	computed: {
		day_fp: function () {
			let fp = parseInt(this.base_fp)+5
			fp += this.fleet_types[this.settings.fleet_type].add[this.settings.enemy_fleet_type?1:0]
			eqlist = this.eqlist
			this.eqs.forEach(function(item, index, array){
				let id = eqlist.id.indexOf(item.id)
				if(item.id == 10 ||item.id == 12){
					fp += eqlist.fac[id][0]*parseInt(item.imp)
				}
				else{
					fp += eqlist.fac[id][0]*Math.sqrt(parseInt(item.imp))
				}
			})
			return fp
		},
		night_fp: function () {
			let fp = parseInt(this.base_fp)
			eqlist = this.eqlist
			this.eqs.forEach(function(item, index, array){
				let id = eqlist.id.indexOf(item.id)
				if(item.id == 10 ||item.id == 12){
					fp += eqlist.fac[id][1]*parseInt(item.imp)
				}
				else{
					fp += eqlist.fac[id][1]*Math.sqrt(parseInt(item.imp))
				}
			})
			return fp
		},
		day_fp_display: function () {
			return Math.floor(this.day_fp)
		},
		night_fp_display: function () {
			return Math.floor(this.night_fp)
		},
		formation_mul: function(){
			let i = this.settings.fleet_formation
			if(i < 10)
				return this.fleet_formations[i].mul
			else
				return this.combined_fleet_formations[i-10].mul
		},
		set: function(){
			let s = JSON.parse(JSON.stringify(this.settings))
			s.formation_mul = this.formation_mul
            s.ammo = this.now_ammo*2/this.max_ammo
            if(s.ammo>1){
                s.ammo = 1
            }
            s.post = this.post
			return s
		}
	}
})
