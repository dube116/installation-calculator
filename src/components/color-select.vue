<template>
    <div class="color-data row">
        <div class="col-xl-4">
            <div class="input-group">
                <div class="input-group-prepend">
                    <span class="input-group-text">上色模式</span>
                </div>
                <select class="form-control" v-model="colorMode">
                    <option v-for="(c, index) in colorModes" v-bind:key="index" v-bind:value="index">
                        {{ c.text }}
                    </option>
                </select>
            </div>
        </div>
        <div class="col-xl-8">
            <table class="example-table table table-borderless">
                <td class="table-danger">
                    最低傷~最高傷<br>
                    {{ percentText[colorMode] }}
                </td>
                <template v-for="(d, index) in colorModes[colorMode].description" v-bind:key="index">
                    <td v-bind:class="classes[index]">
                        {{ d }}
                    </td>
                </template>
            </table>
        </div>
    </div>
</template>

<script>
    
export default {
	data () {
		return {
            classes: ['table-success', 'table-yellow', 'table-warning', 'table-danger'],
            colorModes: [
                {
                    text: '模式一(集積地、砲台適用)',
                    description: ['擊殺率=100%', '擊殺率>50%', '擊殺率>0%', '擊殺率=0%']
                },
                {
                    text: '模式二(一般陸基適用)',
                    description: ['保證中破', '保證小破', '保證擊穿', '不保證擊穿']
                },
                {
                    text: '模式三(強力陸基適用)',
                    description: ['傷害>100', '保證擊穿', '機率擊穿', '無法擊穿']
                }
            ],
            colorMode: 0,
            percentText: ['擊殺率','中破率','擊穿率']
        }
    },
    created: function () {
        this.$emit('update', this.colorMode)
    },
    watch: {
        'colorMode': function (){
            this.$emit('update', this.colorMode)
        },
    }
}
</script>

<style>
.example-table td{
    padding-left: 3px;
    padding-right: 3px;
	vertical-align: middle;
    width: 180px;
}

.example-table{
    margin-bottom: 0px;
	text-align: center;
    width: auto;
}

.table-yellow{
	background-color: #FFFFAA;
}

.color-data {
    margin-bottom: 20px;
    padding-left: 15px;
    padding-right: 15px;
}

.color-data div {
    padding-left: 0px;
    padding-right: 0px;
}
</style>