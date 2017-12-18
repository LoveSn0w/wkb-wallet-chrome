<template>
	<div class="wallet-item">
		<el-row style="line-height: 14px;">
			<el-col :span="24" style="padding:5px 20px 0px;text-align: right;">
				<div>
					<el-button type="text" style="color:#fff;" size="mini" icon="el-icon-delete" @click="deleteList"></el-button>
				</div>
			</el-col>
		</el-row>
		<el-row style="line-height: 20px;">
			<el-col :span="24" style="text-align: center;font-size: 14px;">
				<div>钱包余额</div>
			</el-col>
		</el-row>
		<el-row style="line-height: 40px;">
			<el-col :span="24" style="text-align: center;font-size: 36px;">
				<div>{{data.amount}}</div>
			</el-col>
		</el-row>
		<el-row style="line-height: 30px;">
			<el-col :span="24" style="text-align: center;font-size: 14px;">
				<div>总转账数: {{data.totaltrans}}次  转出: {{data.totaltransout}}次  转入: {{data.totaltrans - data.totaltransout}}次 </div>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="24" style="margin-top:25px;text-align: center;">
				<div>
					<span style="padding:3px 10px;width:350px;border: 1px dashed #fff;">{{data.address}}</span>
				</div>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	export default {
		props: ['data','myindex'],
        methods: {
            deleteList(){
                const app = this.$root.$children[0];
                app.deleteList(this.myindex);
            }
        }
	}
</script>
