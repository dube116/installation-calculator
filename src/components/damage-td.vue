<template>
	<td v-bind:class="color">
		{{ range }}<br>
		{{ Math.floor(rate*100)+"%" }}
	</td>
</template>

<script>
export default {
	props: ['ammo', 'armor', 'hp', 'power', 'times'],
	computed: {
		'bottom': function (){
			let s = this.power - this.armor*0.7-(this.armor-1)*0.6
			s = Math.floor(s)
			return s
		},
		'top': function (){
			let s = this.power - this.armor*0.7
			s = Math.floor(s)
			return s
		},
		'color': function (){
			let r = this.rate
            let s = ''
			if(r==1)
				s = "table-success"
			else if(r>0.5)
				s = "table-yellow"
			else if(r>0)
				s = "table-warning"
			else
				s = "table-danger"
			return s
		},
		'range': function (){
			let b = this.bottom
			let t = this.top
			if(t<=0){
				return "擦傷"
			}
			else if(b<=0){
				return "擦傷~"+Math.floor(t*this.ammo)
			}
			else{
				return Math.floor(b*this.ammo)+"~"+Math.floor(t*this.ammo)
			}
		},
		'rate': function (){
			let s = this.power - this.hp
			s-= this.armor*0.7
			s/= 0.6
			s = Math.floor(s)
			s/= this.armor
			s = s>1?1:s
			s = s<0?0:s
			return s
		}
	}
}
</script>

<style>
td{
	width: 150px;
}

.table-yellow{
	background-color: #FFFFAA;
}
</style>