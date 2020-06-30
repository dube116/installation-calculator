<template>
	<div class="input-group">
		<div class="input-group-prepend">
			<span class="input-group-text">裝備{{ eq.ord }}</span>
		</div>
		<select class="form-control" v-model="eq.id" v-on:change="eq_change">
			<option value=0 disabled selected>
				請選擇裝備
			</option>
			<option v-for="e in eqlist" v-bind:value="e.value" v-bind:title="e.title">
				{{ e.text }}
			</option>
		</select>
		<template v-if="eqlist[eq_id.indexOf(eq.id)!=-1?eq_id.indexOf(eq.id):0].imp">
			<div class="input-group-append">
				<span class="input-group-text">★</span>
			</div>
			<input type="number" class="form-control input-imp" v-model="eq.imp" min="0" max="10">
		</template>
	</div>
</template>
<script>
module.exports = {
	data () {
		return {
			eqlist: [
				{"text": "其他無關裝備", "value": 9999, "imp": false, "title": ""},
				{"text": "大發動艇", "value": 68, "imp": true, "title": ""},
				{"text": "八九式中戰車", "value": 166, "imp": true, "title": ""},
				{"text": "特大發", "value": 193, "imp": true, "title": ""},
				{"text": "特大發+11連隊", "value": 230, "imp": false, "title": ""},
				{"text": "M4A1 DD", "value": 355, "imp": false, "title": ""},
				{"text": "特二式內火艇", "value": 167, "imp": true, "title": ""},
				{"text": "三式彈(改)", "value": 35, "imp": true, "title": ""},
				{"text": "徹甲彈", "value": 36, "imp": true, "title": ""},
				{"text": "WG42", "value": 126, "imp": false, "title": ""},
				{"text": "迫擊砲", "value": 346, "imp": true, "title": ""},
				{"text": "迫擊砲集中配備", "value": 347, "imp": true, "title": ""},
				{"text": "對地噴進炮", "value": 348, "imp": true, "title": ""},
				{"text": "對地噴進炮集中配備", "value": 349, "imp": true, "title": ""},
				{"text": "小口徑主砲", "value": 10001, "imp": true, "title": ""},
				{"text": "中口徑主砲", "value": 10002, "imp": true, "title": ""},
				{"text": "大口徑主砲", "value": 10003, "imp": true, "title": ""},
				{"text": "8cm/10cm/12.7cm高角炮(副炮)", "value": 10, "imp": true, "title": "8cm高角砲(改＋増設機銃)、10cm連装高角砲改＋増設機銃、12.7cm連装高角砲"},
				{"text": "15.5cm副砲", "value": 12, "imp": true, "title": "15.5cm三連装副砲(改)"},
				{"text": "其他副砲", "value": 10004, "imp": true, "title": ""},
				{"text": "魚雷、甲標", "value": 10005, "imp": true, "title": ""},
				{"text": "機槍", "value": 10006, "imp": true, "title": ""},
				{"text": "電探", "value": 10007, "imp": false, "title": ""},
				{"text": "水上戰鬥機", "value": 10008, "imp": false, "title": ""},
				{"text": "水上爆擊機", "value": 10009, "imp": false, "title": ""},
				{"text": "水上偵察機", "value": 10010, "imp": false, "title": ""},
				{"text": "聲納", "value": 10011, "imp": true, "title": ""},
				{"text": "其他爆雷", "value": 10012, "imp": true, "title": ""},
				{"text": "高射裝置", "value": 10013, "imp": true, "title": ""},
				{"text": "探照燈", "value": 10014, "imp": true, "title": ""}
			],
			eq_id: [9999,68,166,193,230,355,167,35,36,126,346,347,348,349,10001,10002,10003,10,12,10004,10005,10006,10007,10008,10009,10010,10011,10012,10013,10014]
		}
	},
	props: ['eq'],
	methods: {
		eq_change: function (event) {
			this.eq.imp = 0
		}
	}
}
</script>
