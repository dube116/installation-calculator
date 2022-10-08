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
        <div class="col-xl-12" v-if="enemyList[target].effect.text!=undefined">
            {{ enemyList[target].effect.text }}
        </div>
    </div>
</template>

<script>
let effects = {
    "artillery": {
        36:{"precap":[1.85]},
        126:{"precap":[1.6, 1.7, 1, 1, 1, 1]},
        348:{"precap":[1.5, 1.8, 1, 1, 1, 1]},
        346:{"precap":[1.3, 1.5, 1, 1, 1, 1]},
        10008:{"precap":[1.5]},
        10011:{"precap":[1.5, 2, 1, 1, 1, 1]},
        68:{"precap":[1.8, 1, 1, 1, 1, 1]},
        193:{"precap":[1.15, 1, 1, 1, 1, 1]},
        166:{"precap":[1.5, 1.4, 1, 1, 1, 1]},
        436:{"precap":[1.5, 1.4, 1, 1, 1, 1]},
        408:{"precap":[1.3, 1.2, 0, 0, 0, 0]},
        355:{"precap":[2, 1, 1, 1, 1, 1]},
        167:{"precap":[2.4, 1.35, 1, 1, 1, 1]},
        "a12":[1.4,1.4,1,1,1,1,1,1,1,1],
        "b12":[0,0,30,0,0,0,0,0,0,0],
        "land_craft_imp":{"precap":true},
        "type_2_imp":{"precap":true},
    },
    "hard": {
        35:{"precap":[1.75]},
        126:{"precap":[1.4, 1.5, 1, 1, 1, 1]},
        348:{"precap":[1.3, 1.65, 1, 1, 1, 1]},
        346:{"precap":[1.2, 1.4, 1, 1, 1, 1]},
        10011:{"precap":[1.4, 1.75, 1, 1, 1, 1]},
        68:{"precap":[1.8, 1, 1, 1, 1, 1]},
        193:{"precap":[1.15, 1, 1, 1, 1, 1]},
        166:{"precap":[1.2, 1.4, 1, 1, 1, 1]},
        436:{"precap":[1.2, 1.4, 1, 1, 1, 1]},
        408:{"precap":[1.3, 1.1, 0, 0, 0, 0]},
        355:{"precap":[1.8, 1, 1, 1, 1, 1]},
        167:{"precap":[2.4, 1.35, 1, 1, 1, 1]},
        "a12":[1,1,1,1,1,1,1,1,1,1],
        "b12":[0,0,30,0,0,0,0,0,0,0],
        "land_craft_imp":{"precap":true},
        "type_2_imp":{"precap":true},
    },
    "harbourSummer": {
        35:{"precap":[1.75]},
        36:{"precap":[1.3]},
        126:{"precap":[1.4, 1.2, 1, 1, 1, 1]},
        348:{"precap":[1.25, 1.4, 1, 1, 1, 1]},
        346:{"precap":[1.1, 1.15, 1, 1, 1, 1]},
        10008:{"precap":[1.3]},
        10011:{"precap":[1.3, 1.2, 1, 1, 1, 1]},
        68:{"precap":[1.7, 1, 1, 1, 1, 1]},
        193:{"precap":[1.2, 1, 1, 1, 1, 1]},
        166:{"precap":[1.6, 1.5, 1, 1, 1, 1]},
        436:{"precap":[1.6, 1.5, 1, 1, 1, 1]},
        408:{"precap":[1.5, 1.1, 0, 0, 0, 0]},
        355:{"precap":[2, 1, 1, 1, 1, 1]},
        167:{"precap":[2.8, 1.5, 1, 1, 1, 1]},
        "a12":[1.4,1.4,1,1,1,1,1,1,1,1],
        "b12":[0,0,30,0,0,0,0,0,0,0],
        "land_craft_imp":{"precap":true},
        "type_2_imp":{"precap":true},
    },
    "soft": {
        35:{"precap":[2.5]},
        126:{"precap":[1.3, 1.4, 1, 1, 1, 1]},
        348:{"precap":[1.25, 1.5, 1, 1, 1, 1]},
        346:{"precap":[1.2, 1.3, 1, 1, 1, 1]},
        10008:{"precap":[1.2]},
        68:{"precap":[1.4, 1, 1, 1, 1, 1]},
        193:{"precap":[1.15, 1, 1, 1, 1, 1]},
        166:{"precap":[1.5, 1.3, 1, 1, 1, 1]},
        436:{"precap":[1.5, 1.3, 1, 1, 1, 1]},
        408:{"precap":[1.1, 1.1, 0, 0, 0, 0]},
        355:{"precap":[1.1, 1, 1, 1, 1, 1]},
        167:{"precap":[1.5, 1.2, 1, 1, 1, 1]},
        "a12":[1,1,1,1,1,1,1,1,1,1],
        "b12":[0,0,30,0,0,0,0,0,0,0],
        "land_craft_imp":{"precap":true},
        "type_2_imp":{"precap":true},
    },
    "supply": {
        35:{"precap":[2.5]},
        126:{"precap":[1.3, 1.4, 1, 1, 1, 1], "postcap":[1.25, 1.3, 1, 1, 1, 1]},
        348:{"precap":[1.25, 1.5, 1, 1, 1, 1], "postcap":[1.2, 1.4, 1, 1, 1, 1]},
        346:{"precap":[1.2, 1.3, 1, 1, 1, 1], "postcap":[1.15, 1.2, 1, 1, 1, 1]},
        10008:{"precap":[1.2]},
        68:{"precap":[1.4, 1, 1, 1, 1, 1], "postcap":[1.7, 1, 1, 1, 1, 1]},
        193:{"precap":[1.15, 1, 1, 1, 1, 1], "postcap":[1.2, 1, 1, 1, 1, 1]},
        166:{"precap":[1.5, 1.3, 1, 1, 1, 1], "postcap":[1.3, 1.6, 1, 1, 1, 1]},
        436:{"precap":[1.5, 1.3, 1, 1, 1, 1], "postcap":[1.3, 1.6, 1, 1, 1, 1]},
        408:{"precap":[1.1, 1.1, 0, 0, 0, 0], "postcap":[1.5, 1.1, 1, 1, 1, 1]},
        355:{"precap":[1.1, 1, 1, 1, 1, 1], "postcap":[1.2, 1, 1, 1, 1, 1]},
        167:{"precap":[1.5, 1.2, 1, 1, 1, 1], "postcap":[1.7, 1.5, 1, 1, 1, 1]},
        "a12":[1,1,1,1,1,1,1,1,1,1],
        "b12":[0,0,30,0,0,0,0,0,0,0],
        "land_craft_imp":{"precap":true, "postcap":true},
        "type_2_imp":{"precap":true, "postcap":true},
        "other":{"postcap":[0]}
    },
    "supply3V": {
        126:{"postcap":[1.25, 1.3, 1, 1, 1, 1]},
        348:{"postcap":[1.2, 1.4, 1, 1, 1, 1]},
        346:{"postcap":[1.15, 1.2, 1, 1, 1, 1]},
        68:{"postcap":[1.7, 1, 1, 1, 1, 1]},
        193:{"postcap":[1.2, 1, 1, 1, 1, 1]},
        166:{"postcap":[1.3, 1.6, 1, 1, 1, 1]},
        436:{"postcap":[1.3, 1.6, 1, 1, 1, 1]},
        408:{"postcap":[1.5, 1.1, 1, 1, 1, 1]},
        355:{"postcap":[1.2, 1, 1, 1, 1, 1]},
        167:{"postcap":[1.7, 1.5, 1, 1, 1, 1]},
        "a12":[1,1,1,1,1,1,1,1,1,1],
        "b12":[0,0,30,0,0,0,0,0,0,0],
        "land_craft_imp":{"postcap":true},
        "type_2_imp":{"postcap":true},
        "other":{"postcap":[0]}
    },
    "anchorWDV": {
        35:{"precap":[1.45]},
        126:{"postcap":[1.2, 1.3, 1, 1, 1, 1]},
        348:{"postcap":[1.1, 1.4, 1, 1, 1, 1]},
        346:{"postcap":[1.1, 1, 1, 1, 1, 1]},
        10011:{"postcap":[1.4, 1.75, 1, 1, 1, 1]},
        68:{"postcap":[1.4, 1, 1, 1, 1, 1]},
        193:{"postcap":[1.15, 1, 1, 1, 1, 1]},
        166:{"postcap":[1.2, 1.4, 1, 1, 1, 1]},
        436:{"postcap":[1.2, 1.4, 1, 1, 1, 1]},
        408:{"postcap":[1.2, 1, 1, 1, 1, 1]},
        355:{"postcap":[1.8, 1, 1, 1, 1, 1]},
        167:{"postcap":[2.4, 1.35, 1, 1, 1, 1]},
        "a12":[1,1,1,1,1,1,1,1,1,1],
        "b12":[0,0,0,0,0,0,0,0,0,0],
        "land_craft_imp":{"postcap":true},
        "type_2_imp":{"postcap":true},
        "text": "第二個迫擊炮、第二台武大/AB未有數據"
    },
    "dock": {
        35:{"precap":[1.3]},
        126:{"postcap":[1.1, 1.2, 1, 1, 1, 1]},
        348:{"postcap":[1.2, 1.4, 1, 1, 1, 1]},
        346:{"postcap":[1.15, 1.2, 1, 1, 1, 1]},
        10008:{"postcap":[1.1]},
        10011:{"postcap":[1.1, 1.1, 1, 1, 1, 1]},
        68:{"postcap":[1.1, 1, 1, 1, 1, 1]},
        193:{"postcap":[1, 1, 1, 1, 1, 1]},
        166:{"postcap":[1.15, 1.15, 1, 1, 1, 1]},
        436:{"postcap":[1.15, 1.15, 1, 1, 1, 1]},
        408:{"postcap":[1.1, 1, 1, 1, 1, 1]},
        355:{"postcap":[1, 1, 1, 1, 1, 1]},
        167:{"postcap":[1.2, 1, 1, 1, 1, 1]},
        230:{"postcap":[1.4, 1, 1, 1, 1, 1]},
        "a12":[1,1,1,1,1,1,1,1,1,1],
        "b12":[0,0,0,0,0,0,0,0,0,0],
        "land_craft_imp":{"postcap":true},
        "type_2_imp":{"postcap":true},
        "text": "對地噴進炮、迫擊炮、特大發、第二台武大/AB、第二台內火未有數據"
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
                    "text":"集積地棲姬 III",
                    "stat":[
                        {"text":"I", "hp":900, "armor":16},
                        {"text":"II", "hp":2000, "armor":126},
                        {"text":"III", "hp":6000, "armor":192},
                        {"text":"壞I", "hp":900, "armor":25},
                        {"text":"壞II", "hp":2000, "armor":147},
                        {"text":"壞III", "hp":6000, "armor":225}
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
                        {"text":"I", "hp":440, "armor":26},
                        {"text":"II", "hp":1200, "armor":137},
                        {"text":"III", "hp":3200, "armor":170},
                        {"text":"IV", "hp":4800, "armor":203},
                        {"text":"壞I", "hp":440, "armor":47},
                        {"text":"壞II", "hp":1200, "armor":169},
                        {"text":"壞III", "hp":3200, "armor":202},
                        {"text":"壞IV", "hp":4800, "armor":225}
                    ],
                    "effect": effects['supply']
                },
                {
                    "text":"集積地棲姫 III バカンスmode",
                    "stat":[
                        {"text":"I", "hp":960, "armor":25},
                        {"text":"II", "hp":1800, "armor":165},
                        {"text":"III", "hp":3600, "armor":44},
                        {"text":"IV", "hp":7200, "armor":194},
                        {"text":"壞I", "hp":960, "armor":135},
                        {"text":"壞II", "hp":1800, "armor":195},
                        {"text":"壞III", "hp":3600, "armor":164},
                        {"text":"壞IV", "hp":7200, "armor":224}
                    ],
                    "effect": effects['supply3V'],
                    "enableTorp": true
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
                        {"text":"IV", "hp":450, "armor":185}
                    ],
                    "effect": effects['hard']
                },
                {
                    "text":"離島棲姬",
                    "stat":[
                        {"text":"I (6-4)", "hp":480, "armor":194}
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
                        {"text":"VI  (3-5 弱 最終)", "hp":390, "armor":125}
                    ],
                    "effect": effects['soft']
                },
                {
                    "text":"リコリス棲姫",
                    "stat":[
                        {"text":"I", "hp":600, "armor":100},
                        {"text":"II", "hp":640, "armor":120},
                        {"text":"III", "hp":680, "armor":140}
                    ],
                    "effect": effects['soft']
                },
                {
                    "text":"泊地水鬼 バカンスmode",
                    "stat":[
                        {"text":"I", "hp":490, "armor":200},
                        {"text":"II", "hp":490, "armor":230},
                        {"text":"III", "hp":490, "armor":270},
                        {"text":"壊I", "hp":490, "armor":220},
                        {"text":"壊II", "hp":490, "armor":250},
                        {"text":"壊III", "hp":490, "armor":290}
                    ],
                    "effect": effects['anchorWDV'],
                    "enableTorp": true
                },
                {
                    "text":"船渠棲姫",
                    "stat":[
                        {"text":"I", "hp":700, "armor":200},
                        {"text":"II", "hp":700, "armor":230},
                        {"text":"III", "hp":700, "armor":260},
                        {"text":"壊I", "hp":700, "armor":240},
                        {"text":"壊II", "hp":700, "armor":270},
                        {"text":"壊III", "hp":700, "armor":300}
                    ],
                    "effect": effects['dock'],
                    "enableTorp": true
                },
                {
                    "text":"砲台小鬼",
                    "stat":[
                        {"text":"I", "hp":130, "armor":100},
                        {"text":"II", "hp":130, "armor":105},
                        {"text":"III", "hp":130, "armor":110}
                    ],
                    "effect": effects['artillery']
                },
            ]
        }
    },
    computed: {
        'enemyInfo': function () {
            let enemy = {}
            enemy.stat = this.enemyList[this.target].stat[this.type]
            enemy.effect = this.enemyList[this.target].effect
            enemy.enableTorp = this.enemyList[this.target].enableTorp
            return enemy
        },
        'hp': function () {
            return this.enemyList[this.target].stat[this.type].hp
        },
        'armor': function () {
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