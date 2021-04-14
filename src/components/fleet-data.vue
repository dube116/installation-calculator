<template>
    <div>
        <div class="input-group">
            <div class="input-group-prepend">
                <span class="input-group-text">艦隊種類:</span>
            </div>
            <select class="form-control" v-model="fleetInfo.fleetType" v-on:change="ftypeChange">
                <option v-for="(f, index) in fleetTypes" v-bind:value="index" v-bind:key="f.id">
                    {{ f.text }}
                </option>
            </select>
        </div>
        <div class="input-group">
            <div class="input-group-prepend">
                <span class="input-group-text">敵艦位置:</span>
            </div>
            <select class="form-control" v-model="fleetInfo.enemyFleetType">
                <option v-for="f in enemyFleetTypes" v-bind:value="f.val" v-bind:key="f.id">
                    {{ f.text }}
                </option>
            </select>
        </div>
        <div class="input-group">
            <div class="input-group-prepend">
                <span class="input-group-text">陣型:</span>
            </div>
            <select class="form-control" v-model="fleetInfo.fleetFormation">
                <template v-if="fleetInfo.fleetType == 0">
                    <option v-for="f in fleetFormations" v-bind:value="f.val" v-bind:key="f.id">
                        {{ f.text }}
                    </option>
                </template>
                <template v-else>
                    <option v-for="f in combinedFleetFormations" v-bind:value="f.val" v-bind:key="f.id">
                        {{ f.text }}
                    </option>
                </template>
            </select>
        </div><br>
    </div>
</template>

<script>
export default {
	data () {
		return {
            fleetTypes: [
                {text: "單艦隊", add: [0, 5]},
                {text: "空母機動部隊 第一艦隊", add: [2, 2]},
                {text: "空母機動部隊 第二艦隊", add: [10, -5]},
                {text: "水上打擊部隊 第一艦隊", add: [10, 2]},
                {text: "水上打擊部隊 第二艦隊", add: [-5, -5]},
                {text: "輸送護衛部隊 第一艦隊", add: [-5, -5]},
                {text: "輸送護衛部隊 第二艦隊", add: [10, -5]}
            ],
            enemyFleetTypes: [
                {text: "單艦隊", val: 0},
                {text: "聯合艦隊 第一艦隊", val: 1},
                {text: "聯合艦隊 第二艦隊", val: 2}
            ],
            fleetFormations: [
                {text: "單縱陣", val: 0, mul: 1},
                {text: "複縱陣", val: 1, mul: 0.8},
                {text: "輪型陣", val: 2, mul: 0.7},
                {text: "梯形陣", val: 3, mul: 0.75},
                {text: "單橫陣", val: 4, mul: 0.6},
                {text: "警戒陣(1~3)", val: 5, mul: 0.5},
                {text: "警戒陣(4~6)", val: 6, mul: 1},
            ],
            combinedFleetFormations: [
                {text: "第一警戒", val: 10, mul: 0.8},
                {text: "第二警戒", val: 11, mul: 1},
                {text: "第三警戒", val: 12, mul: 0.7},
                {text: "第四警戒", val: 13, mul: 1.1},
            ],
            fleetInfo: {
                fleetType: 0,
                enemyFleetType: 0,
                fleetFormation: 0,
                formationMul: 1
            }
		}
	},
    created: function () {
        this.$emit('update', this.fleetInfo)
    },
	methods: {
		ftypeChange: function () {
			if(this.fleetInfo.fleetType==0){
				
				this.fleetInfo.fleetFormation = 0;
			}
			else{
				this.fleetInfo.fleetFormation = 13;
			}
		}
	},
    watch: {
        'fleetInfo.fleetType': function (){
            this.$emit('update', this.fleetInfo)
        },
        'fleetInfo.enemyFleetType': function (){
            this.$emit('update', this.fleetInfo)
        },
        'fleetInfo.fleetFormation': function (){
			if(this.fleetInfo.fleetFormation < 10)
				this.fleetInfo.formationMul = this.fleetFormations[this.fleetInfo.fleetFormation].mul
			else
				this.fleetInfo.formationMul = this.combinedFleetFormations[this.fleetInfo.fleetFormation-10].mul
            this.$emit('update', this.fleetInfo)
        }
    }
}
</script>