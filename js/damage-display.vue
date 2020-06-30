<template>
	<div class="row">
		<div class="col-sm-12">
            <div class="enemy-data">
                <div class="input-group">
                    <div class="input-group-prepend">
                        <span class="input-group-text">目標</span>
                    </div>
                    <select class="form-control" v-model="target" v-on:change="target_change">
                        <option v-for="e in enemy_list" v-bind:value="e.id">
                            {{ e.text }}
                        </option>
                    </select>
                    <select class="form-control" v-model="type" v-if="enemy_list[target]['stat'].length>1">
                        <option v-for="e in enemy_list[target]['stat']" v-bind:value="e.id">
                            {{ e.text }}
                        </option>
                    </select>
                </div>
                <div class="input-group">
                    <div class="input-group-prepend">
                        <span class="input-group-text">耐久</span>
                    </div>
                    <input type="number" class="form-control" disabled v-bind:value="hp">
                    <div class="input-group-prepend">
                        <span class="input-group-text">裝甲</span>
                    </div>
                    <input type="number" class="form-control" disabled v-bind:value="armor">
                </div>
            </div>
		</div>
		<div class="col-sm-12">
			<div class="row">
                <template v-if="!(settings.fleet_type%2==0&&settings.fleet_type!=0&&settings.enemy_fleet_type==1)">
                    <datb v-bind:settings="settings" v-bind:fp="day_fp" v-bind:type="attack_types[0]" ></datb>
                </template>
                <template v-if="settings.fleet_type%2==0">
                    <datb v-bind:settings="settings" v-bind:fp="night_fp" v-bind:type="attack_types[1]"></datb>
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
module.exports = {
	data () {
		return {
			enemy_list: [
				{
					"id":0,
					"text":"集積地棲姬",
					"stat":[
						{"id":0, "text":"I", "hp":600, "armor":100},
						{"id":1, "text":"II", "hp":600, "armor":130},
						{"id":2, "text":"III", "hp":600, "armor":160},
						{"id":3, "text":"壞I", "hp":380, "armor":130},
						{"id":4, "text":"壞II", "hp":430, "armor":160},
						{"id":5, "text":"壞III", "hp":480, "armor":190}
					],
					"effect": {
						68:{"a13":[1.4, 1, 1, 1, 1, 1], "a6":[1.7, 1, 1, 1, 1, 1]},
						166:{"a13":[1.5, 1.3, 1, 1, 1, 1], "a6":[1.3, 1.6, 1, 1, 1, 1]},
						193:{"a13":[1.15, 1, 1, 1, 1, 1], "a6":[1.2, 1, 1, 1, 1, 1]},
						230:{"a13":[1.8, 1, 1, 1, 1, 1], "b13":[25, 0, 0, 0, 0, 0], "a6":[1, 1, 1, 1, 1, 1]},
						355:{"a13":[1.1, 1, 1, 1, 1, 1], "b13":[25, 0, 0, 0, 0, 0], "a6":[1.2, 1, 1, 1, 1, 1]},
						167:{"a13":[1.5, 1.2, 1, 1, 1, 1], "a6":[1.7, 1.5, 1, 1, 1, 1]},
                        126:{"a13":[1.3, 1.4, 1, 1, 1, 1], "b13":[75, 35, 30, 20, 0, 0], "a6":[1.25, 1.3, 1, 1, 1, 1]},
                        346:{"a13":[1.2, 1.3, 1, 1, 1, 1], "b13":[30, 25, 20, 15, 0, 0], "a6":[1.15, 1.2, 1, 1, 1, 1]},
                        347:{"b13":[60, 50, 40, 30, 0, 0]},
                        348:{"a13":[1.25, 1.5, 1, 1, 1, 1], "b13":[55, 60, 45, 30, 0, 0], "a6":[1.2, 1.4, 1, 1, 1, 1]},
                        349:{"b13":[80, 90, 0, 0, 0, 0]},
                        35:{"a13":[2.5]},
                        10008:{"a13":[1.2]},
                        //AP
						"a12":[1,1,1,1,1,1,1,1,1,1],
						"b12":[0,30,0,0,0,0,0,0,0,0],
						"land_craft_imp":{"a13":true, "a6":true},
						"type_2_imp":{"a13":true, "a6":true},
						"other":{"a6":[0]}
					}
				},
                {
					"id":1,
					"text":"集積地棲姬 II",
					"stat":[
						{"id":0, "text":"I", "hp":600, "armor":50},
						{"id":1, "text":"II", "hp":660, "armor":130},
						{"id":2, "text":"III", "hp":990, "armor":180},
						{"id":3, "text":"壞I", "hp":600, "armor":80},
						{"id":4, "text":"壞II", "hp":660, "armor":170},
						{"id":5, "text":"壞III", "hp":990, "armor":240}
					],
					"effect": {
						68:{"a13":[1.4, 1, 1, 1, 1, 1], "a6":[1.7, 1, 1, 1, 1, 1]},
						166:{"a13":[1.5, 1.3, 1, 1, 1, 1], "a6":[1.3, 1.6, 1, 1, 1, 1]},
						193:{"a13":[1.15, 1, 1, 1, 1, 1], "a6":[1.2, 1, 1, 1, 1, 1]},
						230:{"a13":[1.8, 1, 1, 1, 1, 1], "b13":[25, 0, 0, 0, 0, 0], "a6":[1, 1, 1, 1, 1, 1]},
						355:{"a13":[1.1, 1, 1, 1, 1, 1], "b13":[25, 0, 0, 0, 0, 0], "a6":[1.2, 1, 1, 1, 1, 1]},
						167:{"a13":[1.5, 1.2, 1, 1, 1, 1], "a6":[1.7, 1.5, 1, 1, 1, 1]},
                        126:{"a13":[1.3, 1.4, 1, 1, 1, 1], "b13":[75, 35, 30, 20, 0, 0], "a6":[1.25, 1.3, 1, 1, 1, 1]},
                        346:{"a13":[1.2, 1.3, 1, 1, 1, 1], "b13":[30, 25, 20, 15, 0, 0], "a6":[1.15, 1.2, 1, 1, 1, 1]},
                        347:{"b13":[60, 50, 40, 30, 0, 0]},
                        348:{"a13":[1.25, 1.5, 1, 1, 1, 1], "b13":[55, 60, 45, 30, 0, 0], "a6":[1.2, 1.4, 1, 1, 1, 1]},
                        349:{"b13":[80, 90, 0, 0, 0, 0]},
                        35:{"a13":[2.5]},
                        //AP plane
						"a12":[1,1,1,1,1,1,1,1,1,1],
						"b12":[0,30,0,0,0,0,0,0,0,0],
						"land_craft_imp":{"a13":true, "a6":true},
						"type_2_imp":{"a13":true, "a6":true},
						"other":{"a6":[0]}
					}
				},
                {
					"id":2,
					"text":"集積地夏姬",
					"stat":[
						{"id":0, "text":"I", "hp":690, "armor":133},
						{"id":1, "text":"II", "hp":690, "armor":163}
					],
					"effect": {
						68:{"a13":[1.4, 1, 1, 1, 1, 1], "a6":[1.7, 1, 1, 1, 1, 1]},
						166:{"a13":[1.5, 1.3, 1, 1, 1, 1], "a6":[1.3, 1.6, 1, 1, 1, 1]},
						193:{"a13":[1.15, 1, 1, 1, 1, 1], "a6":[1.2, 1, 1, 1, 1, 1]},
						230:{"a13":[1.8, 1, 1, 1, 1, 1], "b13":[25, 0, 0, 0, 0, 0], "a6":[1, 1, 1, 1, 1, 1]},
						355:{"a13":[1.1, 1, 1, 1, 1, 1], "b13":[25, 0, 0, 0, 0, 0], "a6":[1.2, 1, 1, 1, 1, 1]},
						167:{"a13":[1.5, 1.2, 1, 1, 1, 1], "a6":[1.7, 1.5, 1, 1, 1, 1]},
                        126:{"a13":[1.3, 1.4, 1, 1, 1, 1], "b13":[75, 35, 30, 20, 0, 0], "a6":[1.25, 1.3, 1, 1, 1, 1]},
                        346:{"a13":[1.2, 1.3, 1, 1, 1, 1], "b13":[30, 25, 20, 15, 0, 0], "a6":[1.15, 1.2, 1, 1, 1, 1]},
                        347:{"b13":[60, 50, 40, 30, 0, 0]},
                        348:{"a13":[1.25, 1.5, 1, 1, 1, 1], "b13":[55, 60, 45, 30, 0, 0], "a6":[1.2, 1.4, 1, 1, 1, 1]},
                        349:{"b13":[80, 90, 0, 0, 0, 0]},
                        35:{"a13":[2.5]},
                        //AP plane
						"a12":[1,1,1,1,1,1,1,1,1,1],
						"b12":[0,30,0,0,0,0,0,0,0,0],
						"land_craft_imp":{"a13":true, "a6":true},
						"type_2_imp":{"a13":true, "a6":true},
						"other":{"a6":[0]}
					}
				},
                {
					"id":3,
					"text":"集積地棲姫II 夏季上陸mode",
					"stat":[
						{"id":0, "text":"I", "hp":600, "armor":34},
						{"id":1, "text":"II", "hp":1200, "armor":124},
						{"id":2, "text":"III", "hp":2400, "armor":174},
						{"id":3, "text":"壞I", "hp":600, "armor":64},
						{"id":4, "text":"壞II", "hp":1200, "armor":164},
						{"id":5, "text":"壞III", "hp":2400, "armor":234}
					],
					"effect": {
						68:{"a13":[1.4, 1, 1, 1, 1, 1], "a6":[1.7, 1, 1, 1, 1, 1]},
						166:{"a13":[1.5, 1.3, 1, 1, 1, 1], "a6":[1.3, 1.6, 1, 1, 1, 1]},
						193:{"a13":[1.15, 1, 1, 1, 1, 1], "a6":[1.2, 1, 1, 1, 1, 1]},
						230:{"a13":[1.8, 1, 1, 1, 1, 1], "b13":[25, 0, 0, 0, 0, 0], "a6":[1, 1, 1, 1, 1, 1]},
						355:{"a13":[1.1, 1, 1, 1, 1, 1], "b13":[25, 0, 0, 0, 0, 0], "a6":[1.2, 1, 1, 1, 1, 1]},
						167:{"a13":[1.5, 1.2, 1, 1, 1, 1], "a6":[1.7, 1.5, 1, 1, 1, 1]},
                        126:{"a13":[1.3, 1.4, 1, 1, 1, 1], "b13":[75, 35, 30, 20, 0, 0], "a6":[1.25, 1.3, 1, 1, 1, 1]},
                        346:{"a13":[1.2, 1.3, 1, 1, 1, 1], "b13":[30, 25, 20, 15, 0, 0], "a6":[1.15, 1.2, 1, 1, 1, 1]},
                        347:{"b13":[60, 50, 40, 30, 0, 0]},
                        348:{"a13":[1.25, 1.5, 1, 1, 1, 1], "b13":[55, 60, 45, 30, 0, 0], "a6":[1.2, 1.4, 1, 1, 1, 1]},
                        349:{"b13":[80, 90, 0, 0, 0, 0]},
                        35:{"a13":[2.5]},
                        //AP plane
						"a12":[1,1,1,1,1,1,1,1,1,1],
						"b12":[0,30,0,0,0,0,0,0,0,0],
						"land_craft_imp":{"a13":true, "a6":true},
						"type_2_imp":{"a13":true, "a6":true},
						"other":{"a6":[0]}
					}
				},
				/*{
					"id":1,
					"text":"港灣棲姬",
					"stat":[
						{"id":0, "text":"I", "hp":380, "armor":777},
					],
					"effect": {
						68:{"a13":[1.4, 1, 1, 1, 1, 1], "a6":[1.7, 1, 1, 1, 1, 1]},
						166:{"a13":[1.5, 1.3, 1, 1, 1, 1], "a6":[1.3, 1.6, 1, 1, 1, 1]},
						193:{"a13":[1.15, 1, 1, 1, 1, 1], "a6":[1.2, 1, 1, 1, 1, 1]},
						230:{"a13":[1.8, 1, 1, 1, 1, 1], "b13":[25, 0, 0, 0, 0, 0]},
						355:{"a13":[1.1, 1, 1, 1, 1, 1], "b13":[25, 0, 0, 0, 0, 0]},
						167:{"a13":[1.5, 1.2, 1, 1, 1, 1], "a6":[1.7, 1.5, 1, 1, 1, 1]},
						"a12":[1,1,1,1,1,1,1,1,1,1],
						"b12":[0,30,0,0,0,0,0,0,0,0],
						"land_craft_imp":{"a13":true},
						"type_2_imp":{"a13":true},
					}
				}*/
			],
			attack_types:[
				{"id": 0, "text": "日戰 普通攻擊", "day": true},
                {"id": 1000, "text": "夜戰", "day": false}
			],
			eq_id: [],
			target: 0,
			type: 0
		}
	},
	props: ['set', 'day_fp', 'night_fp', 'eqs'],
	methods: {
		target_change: function (event) {
			this.type = 0
		}
	},
	components: {
		'datb': httpVueLoader('./damage-table.vue')
	},
	computed: {
		'settings': function (){
			let s = JSON.parse(JSON.stringify(this.set))
			s.eqs = this.eqs
			s.enemy = {}
			s.enemy.stat = this.enemy_list[this.target].stat[this.type]
			s.enemy.effect = this.enemy_list[this.target].effect
			return s
		},
		'hp': function (){
			return this.enemy_list[this.target].stat[this.type].hp
		},
		'armor': function (){
			return this.enemy_list[this.target].stat[this.type].armor
		}
	}
}
</script>
