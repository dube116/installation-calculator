<template>
	<tr>
		<td scope="row">{{ title }}</td>
		<template  v-for="p in power">
			<datd v-bind:power="p" v-bind:armor="enemy.armor" v-bind:hp="enemy.hp" v-bind:ammo="ammo"></datd>
		</template>
	</tr>
</template>
<script>
module.exports = {
	props: ['power', 'title', 'enemy', 'ammo'],
	components: {
		'datd': httpVueLoader('./damage-td.vue')
	}
}
</script>