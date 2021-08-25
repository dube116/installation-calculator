<template>
    <div class="enemy-data row">
        <div class="col-xl-6">
            <div class="input-group">
                <div class="input-group-prepend">
                    <span class="input-group-text">目標</span>
                </div>
                <select class="form-control" v-model="target" v-on:change="target_change">
                    <option v-for="(e, index) in enemyList" v-bind:value="index" v-bind:key="index">
                        {{ e.text }}
                    </option>
                </select>
                <select class="form-control" v-model="type" v-if="enemyList[target]['stat'].length>1" v-on:change="type_change">
                    <option v-for="(e, index) in enemyList[target]['stat']" v-bind:value="index" v-bind:key="index">
                        {{ e.text }}
                    </option>
                </select>
            </div>
        </div>
        <div class="col-xl-6">
            <div class="input-group">
                <div class="input-group-prepend ">
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
</template>

<script>
let effects = {
    "Artillery": {
        68:{"a13":[1.8, 1, 1, 1, 1, 1]},
        166:{"a13":[1.5, 1.4, 1, 1, 1, 1]},
        193:{"a13":[1.15, 1, 1, 1, 1, 1]},
        230:{"a13":[1.8, 1, 1, 1, 1, 1], "b13":[25, 0, 0, 0, 0, 0]},
        355:{"a13":[2, 1, 1, 1, 1, 1], "b13":[25, 0, 0, 0, 0, 0]},
        167:{"a13":[2.4, 1.35, 1, 1, 1, 1]},
        126:{"a13":[1.6, 1.7, 1, 1, 1, 1], "b13":[75, 35, 30, 20, 0, 0]},
        346:{"a13":[1.3, 1.5, 1, 1, 1, 1], "b13":[30, 25, 20, 15, 0, 0]},
        347:{"b13":[60, 50, 40, 30, 0, 0]},
        348:{"a13":[1.5, 1.8, 1, 1, 1, 1], "b13":[55, 60, 45, 30, 0, 0]},
        349:{"b13":[80, 90, 0, 0, 0, 0]},
        408:{"a13":[1.3, 1.2, 0, 0, 0, 0]},
        36:{"a13":[1.85]},
        10008:{"a13":[1.5]},
        "a12":[1.4,1.4,1,1,1,1,1,1,1,1],
        "b12":[0,0,30,0,0,0,0,0,0,0],
        "land_craft_imp":{"a13":true},
        "type_2_imp":{"a13":true},
    },
    "hard": {
        68:{"a13":[1.8, 1, 1, 1, 1, 1]},
        166:{"a13":[1.2, 1.4, 1, 1, 1, 1]},
        193:{"a13":[1.15, 1, 1, 1, 1, 1]},
        230:{"a13":[1.8, 1, 1, 1, 1, 1], "b13":[25, 0, 0, 0, 0, 0]},
        355:{"a13":[1.8, 1, 1, 1, 1, 1], "b13":[25, 0, 0, 0, 0, 0]},
        167:{"a13":[2.4, 1.35, 1, 1, 1, 1]},
        126:{"a13":[1.4, 1.5, 1, 1, 1, 1], "b13":[75, 35, 30, 20, 0, 0]},
        346:{"a13":[1.2, 1.4, 1, 1, 1, 1], "b13":[30, 25, 20, 15, 0, 0]},
        347:{"b13":[60, 50, 40, 30, 0, 0]},
        348:{"a13":[1.3, 1.65, 1, 1, 1, 1], "b13":[55, 60, 45, 30, 0, 0]},
        349:{"b13":[80, 90, 0, 0, 0, 0]},
        408:{"a13":[1.3, 1.1, 0, 0, 0, 0]},
        35:{"a13":[1.75]},
        "a12":[1,1,1,1,1,1,1,1,1,1],
        "b12":[0,0,30,0,0,0,0,0,0,0],
        "land_craft_imp":{"a13":true},
        "type_2_imp":{"a13":true},
    },
    "soft": {
        68:{"a13":[1.4, 1, 1, 1, 1, 1]},
        166:{"a13":[1.5, 1.3, 1, 1, 1, 1]},
        193:{"a13":[1.15, 1, 1, 1, 1, 1]},
        230:{"a13":[1.8, 1, 1, 1, 1, 1], "b13":[25, 0, 0, 0, 0, 0]},
        355:{"a13":[1.1, 1, 1, 1, 1, 1], "b13":[25, 0, 0, 0, 0, 0]},
        167:{"a13":[1.5, 1.2, 1, 1, 1, 1]},
        126:{"a13":[1.3, 1.4, 1, 1, 1, 1], "b13":[75, 35, 30, 20, 0, 0]},
        346:{"a13":[1.2, 1.3, 1, 1, 1, 1], "b13":[30, 25, 20, 15, 0, 0]},
        347:{"b13":[60, 50, 40, 30, 0, 0]},
        348:{"a13":[1.25, 1.5, 1, 1, 1, 1], "b13":[55, 60, 45, 30, 0, 0]},
        349:{"b13":[80, 90, 0, 0, 0, 0]},
        408:{"a13":[1.1, 1.1, 0, 0, 0, 0]},
        35:{"a13":[2.5]},
        10008:{"a13":[1.2]},
        "a12":[1,1,1,1,1,1,1,1,1,1],
        "b12":[0,0,30,0,0,0,0,0,0,0],
        "land_craft_imp":{"a13":true},
        "type_2_imp":{"a13":true},
    },
    "supply": {
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
        408:{"a13":[1.1, 1.1, 0, 0, 0, 0], "a6":[1.5, 1.1, 1, 1, 1, 1]},
        35:{"a13":[2.5]},
        10008:{"a13":[1.2]},
        "a12":[1,1,1,1,1,1,1,1,1,1],
        "b12":[0,0,30,0,0,0,0,0,0,0],
        "land_craft_imp":{"a13":true, "a6":true},
        "type_2_imp":{"a13":true, "a6":true},
        "other":{"a6":[0]}
    },
    "harbourSummer": {
        68:{"a13":[1.7, 1, 1, 1, 1, 1]},
        166:{"a13":[1.6, 1.5, 1, 1, 1, 1]},
        193:{"a13":[1.2, 1, 1, 1, 1, 1]},
        230:{"a13":[1.8, 1, 1, 1, 1, 1], "b13":[25, 0, 0, 0, 0, 0]},
        355:{"a13":[2, 1, 1, 1, 1, 1], "b13":[25, 0, 0, 0, 0, 0]},
        167:{"a13":[2.8, 1.5, 1, 1, 1, 1]},
        126:{"a13":[1.4, 1.2, 1, 1, 1, 1], "b13":[75, 35, 30, 20, 0, 0]},
        346:{"a13":[1.1, 1.15, 1, 1, 1, 1], "b13":[30, 25, 20, 15, 0, 0]},
        347:{"b13":[60, 50, 40, 30, 0, 0]},
        348:{"a13":[1.25, 1.4, 1, 1, 1, 1], "b13":[55, 60, 45, 30, 0, 0]},
        349:{"b13":[80, 90, 0, 0, 0, 0]},
        35:{"a13":[1.75]},
        36:{"a13":[1.3]},
        10008:{"a13":[1.3]},
        "a12":[1,1,1,1,1,1,1,1,1,1],
        "b12":[0,0,30,0,0,0,0,0,0,0],
        "land_craft_imp":{"a13":true},
        "type_2_imp":{"a13":true},
    }
}
export default {
    data() {
        return {
            counter: this.initialCounter,
            target: 0,
            type: 0,
            enemyList: [
                {
                    "text":"集積地棲姬",
                    "stat":[
                        {"text":"I", "hp":600, "armor":100},
                        {"text":"II", "hp":600, "armor":130},
                        {"text":"III", "hp":600, "armor":160},
                        {"text":"壞I", "hp":380, "armor":130},
                        {"text":"壞II", "hp":430, "armor":160},
                        {"text":"壞III", "hp":480, "armor":190}
                    ],
                    "effect": effects['supply']
                },
                {
                    "text":"集積地棲姬 II",
                    "stat":[
                        {"text":"I", "hp":600, "armor":50},
                        {"text":"II", "hp":660, "armor":130},
                        {"text":"III", "hp":990, "armor":180},
                        {"text":"壞I", "hp":600, "armor":80},
                        {"text":"壞II", "hp":660, "armor":170},
                        {"text":"壞III", "hp":990, "armor":240}
                    ],
                    "effect": effects['supply']
                },
                {
                    "text":"集積地夏姬",
                    "stat":[
                        {"text":"I", "hp":690, "armor":133},
                        {"text":"II", "hp":690, "armor":163}
                    ],
                    "effect": effects['supply']
                },
                {
                    "text":"集積地棲姫 II 夏季上陸mode",
                    "stat":[
                        {"text":"I", "hp":600, "armor":34},
                        {"text":"II", "hp":1200, "armor":124},
                        {"text":"III", "hp":2400, "armor":174},
                        {"text":"壞I", "hp":600, "armor":64},
                        {"text":"壞II", "hp":1200, "armor":164},
                        {"text":"壞III", "hp":2400, "armor":234}
                    ],
                    "effect": effects['supply']
                },
                {
                    "text":"集積地棲姫 II バカンスmode",
                    "stat":[
                        {"text":"I", "hp":440, "armor":22},
                        {"text":"II", "hp":1200, "armor":133},
                        {"text":"III", "hp":3200, "armor":166},
                        {"text":"IV", "hp":4800, "armor":199},
                        {"text":"壞I", "hp":440, "armor":44},
                        {"text":"壞II", "hp":1200, "armor":166},
                        {"text":"壞III", "hp":3200, "armor":199},
                        {"text":"壞IV", "hp":4800, "armor":222}
                    ],
                    "effect": effects['supply']
                },
                {
                    "text":"飛行場姬",
                    "stat":[
                        {"text":"I", "hp":500, "armor":140},
                        {"text":"II", "hp":500, "armor":160},
                        {"text":"III", "hp":500, "armor":175},
                        {"text":"IV", "hp":500, "armor":190}
                    ],
                    "effect": effects['soft']
                },
                {
                    "text":"港灣棲姬",
                    "stat":[
                        {"text":"I  (4-3 4-5)", "hp":380, "armor":135},
                        {"text":"II (4-5 最終)", "hp":490, "armor":183}
                    ],
                    "effect": effects['soft']
                },
                {
                    "text":"港灣水鬼",
                    "stat":[
                        {"text":"I", "hp":450, "armor":135},
                        {"text":"II", "hp":450, "armor":140},
                        {"text":"III", "hp":500, "armor":140},
                        {"text":"IV", "hp":500, "armor":160}
                    ],
                    "effect": effects['soft']
                },
                {
                    "text":"港灣夏姬",
                    "stat":[
                        {"text":"I", "hp":500, "armor":34},
                        {"text":"II", "hp":600, "armor":124},
                        {"text":"III", "hp":700, "armor":174},
                        {"text":"壞I", "hp":444, "armor":164},
                        {"text":"壞II", "hp":544, "armor":184},
                        {"text":"壞III", "hp":644, "armor":214}
                    ],
                    "effect": effects['harbourSummer']
                },
                {
                    "text":"港灣夏姬 II",
                    "stat":[
                        {"text":"I", "hp":750, "armor":14},
                        {"text":"II", "hp":1050, "armor":186},
                        {"text":"III", "hp":1550, "armor":226},
                        {"text":"壞I", "hp":750, "armor":18},
                        {"text":"壞II", "hp":1050, "armor":216},
                        {"text":"壞III", "hp":1550, "armor":246}
                    ],
                    "effect": effects['harbourSummer']
                },
                {
                    "text":"離島棲鬼",
                    "stat":[
                        {"text":"I", "hp":450, "armor":150},
                        {"text":"II", "hp":450, "armor":155},
                        {"text":"III", "hp":450, "armor":170},
                        {"text":"IV", "hp":450, "armor":185},
                    ],
                    "effect": effects['hard']
                },
                {
                    "text":"離島棲姬",
                    "stat":[
                        {"text":"I (6-4)", "hp":480, "armor":194},
                    ],
                    "effect": effects['hard']
                },
                {
                    "text":"北方棲姬",
                    "stat":[
                        {"text":"I", "hp":360, "armor":135},
                        {"text":"II", "hp":500, "armor":145},
                        {"text":"III (3-5)", "hp":300, "armor":125},
                        {"text":"IV  (3-5 最終)", "hp":390, "armor":140},
                        {"text":"V   (3-5 弱)", "hp":300, "armor":110},
                        {"text":"VI  (3-5 弱 最終)", "hp":390, "armor":125},
                    ],
                    "effect": effects['soft']
                },
                {
                    "text":"リコリス棲姫",
                    "stat":[
                        {"text":"I", "hp":600, "armor":100},
                        {"text":"II", "hp":640, "armor":120},
                        {"text":"III", "hp":680, "armor":140},
                    ],
                    "effect": effects['soft']
                },
                {
                    "text":"砲台小鬼",
                    "stat":[
                        {"text":"I", "hp":130, "armor":100},
                        {"text":"II", "hp":130, "armor":105},
                        {"text":"III", "hp":130, "armor":110},
                    ],
                    "effect": effects['Artillery']
                },
            ]
        }
    },
    computed: {
        'enemyInfo': function (){
            let enemy = {}
            enemy.stat = this.enemyList[this.target].stat[this.type]
            enemy.effect = this.enemyList[this.target].effect
            return enemy
        },
        'hp': function (){
            return this.enemyList[this.target].stat[this.type].hp
        },
        'armor': function (){
            return this.enemyList[this.target].stat[this.type].armor
        }
    },
    created: function () {
        this.$emit('update', this.enemyInfo)
    },
    methods: {
        target_change: function () {
            this.type = 0
        }
    },
    watch: {
        enemyInfo: function (){
            this.$emit('update', this.enemyInfo)
        }
    }
    
}
</script>

<style scoped>
.enemy-data {
    margin-bottom: 20px;
    padding-left: 15px;
    padding-right: 15px;
}

.enemy-data .col-xl-6 {
    padding-left: 0px;
    padding-right: 0px;
}
</style>