<template>
	<tr>
		<th scope="row" class="row-head">{{ title+((times>1&&!day)?'('+times+'回攻擊)':'') }}</th>
		<template v-for="(p, index) in power" v-bind:key="index">
			<damage-td  v-bind:settings="settings" v-bind:ammo="ammo" v-bind:armor="enemy.armor" v-bind:hp="enemy.hp" v-bind:power="p" v-bind:times="times"/>
		</template>
	</tr>
</template>

<script>
import damageTd from './damage-td.vue'

export default {
	props: ['ammo', 'day', 'enemy', 'power', 'times', 'title', 'settings'],
	components: {
		damageTd
	}
}
</script>

<style>
th.row-head{
	width: 180px;
	vertical-align: middle;
}
</style>