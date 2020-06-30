<template>
	<td v-bind:class="cl">
		{{ range }}<br>
		{{ rate }}
	</td>
</template>
<script>
module.exports = {
	data () {
		return {
			"cl":"table-danger"
		}
	},
	props: ['power', 'armor', 'hp', 'ammo'],
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
		'range': function (){
			b = this.bottom
			t = this.top
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
			if(s==1)
				this.cl="table-success"
			else if(s>0.5)
				this.cl="table-yellow"
			else if(s>0)
				this.cl="table-warning"
			else
				this.cl="table-danger"
			s = Math.floor(s*100)+"%" 
			return s
		},
		'color': function (){
			
		}
	}
}
</script>