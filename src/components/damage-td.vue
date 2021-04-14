<template>
	<td v-bind:class="color" data-toggle="tooltip" data-placement="top" v-bind:data-tooltip="powerText">
		{{ range }}<br>
		{{ Math.floor(rate*100)+"%" }}
	</td>
</template>

<script>
export default {
	props: ['ammo', 'armor', 'hp', 'power', 'times', 'settings'],
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
            let s = ''
            if (this.settings.colorMode == 0) {
                let r = this.rate
                if (r == 1)
                    s = "table-success"
                else if (r >= 0.5)
                    s = "table-yellow"
                else if (r > 0)
                    s = "table-warning"
                else
                    s = "table-danger"
            } 
            else if (this.settings.colorMode == 1) {
                let b = Math.floor(this.bottom*this.ammo) * this.times
                let h = this.hp
                if (b >= 0.5 * h)
                    s = "table-success"
                else if (b >= 0.25 * h)
                    s = "table-yellow"
                else if (b > 0)
                    s = "table-warning"
                else
                    s = "table-danger"
            } 
            else if (this.settings.colorMode == 2) {
                let b = Math.floor(this.bottom*this.ammo) * this.times
                let t = Math.floor(this.top*this.ammo)
                if (b >= 100)
                    s = "table-success"
                else if (b > 0)
                    s = "table-yellow"
                else if (t > 0)
                    s = "table-warning"
                else
                    s = "table-danger"
            } 
			return s
		},
		'range': function (){
			let b = Math.floor(this.bottom*this.ammo)
			let t = Math.floor(this.top*this.ammo)
			if(t <= 0){
				return "擦傷"
			}
			else if(b <= 0){
				return "擦傷~"+t
			}
			else{
				return b+"~"+t
			}
		},
		'rate': function (){
            if (this.ammo == 0)
                return 0
            let h = this.targetHp / this.ammo
            let p = this.power - this.armor*0.7
            let r = (this.armor-1)*0.6
            let s
            if (this.times == 2){
                if (h > this.top * 2) {
                    s = 0
                }
                else if (h <= this.bottom * 2) {
                    s = 1
                }
                else {
                    s = 0
                    let penetrate = p - 1
                    penetrate/= r                    
                    penetrate = this.interval(penetrate)
                    let op = penetrate * (1 - penetrate)
                    if (this.settings.colorMode == 2) {
                        s = 1-((1 - penetrate)**2)
                    }
                    else if (penetrate != 0) {
                        let firstPen
                        let secondPen
                        let twoPen
                        let hp2 =  h - this.hp*0.06
                        let r2 = (this.hp-1)*0.08
                        if (h > this.top+this.bottom) {
                            firstPen = 0
                            twoPen = ((2*p-h)**2)/2/(r**2)
                        }
                        else {
                            firstPen = (p - h ) / r
                            twoPen = 1-(((h-2*p+2*r)**2)/2/(r**2))
                        }
                        if (hp2 > this.top + r2) {
                            secondPen = 0
                        }
                        else if (hp2 > this.top) {
                            secondPen = (p+r2-hp2)**2/2/(r*r2)
                        }
                        else if (hp2 < this.bottom + r2 ){
                            secondPen = 1-((hp2-p+r)**2/2/(r*r2))
                        }
                        else {
                            secondPen = (p-hp2-0.5*r2)/r
                        }
                        twoPen = this.interval(twoPen)
                        firstPen = this.interval(firstPen)
                        secondPen = this.interval(secondPen)
                        
                        s+= twoPen * (penetrate**2)
                        s+= firstPen * op
                        s+= secondPen * op
                    }
                }
            }
            else {
                s = p - h
                s/= r
                s = this.interval(s)
            }
			return s
		},
        'targetHp': function () {
            let re = this.hp
            if (this.settings.colorMode == 1) {
                re = Math.ceil(re * 0.5)
            } 
            else if (this.settings.colorMode == 2) {
                re = 1
            } 
			return re
        },
        'powerText': function () {
            return '最終攻擊力' + Math.floor(this.power)
        }
	},    
    methods: {
        interval: function (n){
            n = n>1?1:n
            n = n<0?0:n
            return n
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
[data-tooltip] {
  position: relative;
  cursor: pointer;
}

[data-tooltip]:before,
[data-tooltip]:after {
  visibility: hidden;
  -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";
  filter: progid: DXImageTransform.Microsoft.Alpha(Opacity=0);
  opacity: 0;
  pointer-events: none;
}

[data-tooltip]:before {
  position: absolute;
  top: -40px;
  left: calc(50% - 45px);
  padding: 7px;
  width: 90px;
  border-radius: 3px;
  background-color: #000;
  background-color: hsla(0, 0%, 20%, 0.9);
  color: #fff;
  content: attr(data-tooltip);
  text-align: center;
  font-size: 14px;
  line-height: 1.2;
}

[data-tooltip]:after {
  position: absolute;
  top: 5px;
  left: 50%;
  margin-left: -5px;
  width: 0;
  border-top: 10px solid #000;
  border-top: 10px solid hsla(0, 0%, 20%, 0.9);
  border-right: 8px solid transparent;
  border-left: 8px solid transparent;
  content: " ";
  font-size: 0;
  line-height: 0;
}

[data-tooltip]:hover:before,
[data-tooltip]:hover:after {
  visibility: visible;
  -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)";
  filter: progid: DXImageTransform.Microsoft.Alpha(Opacity=100);
  opacity: 1;
}
</style>