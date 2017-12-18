<template>
	<div id="app">
		<p class="app-title" style="width:100%;">玩客币钱包插件 v{{appDetail.version}} <el-button plain type="primary" size="mini" style="margin-left: 20px;" icon="el-icon-plus" @click="showInputArea">添加钱包</el-button></p>


		<el-row style="margin-top: -10px;border:1px solid #ebebeb;padding: 10px;">
            <div style="height:227px;line-height: 227px;text-align: center;" v-show="!store.walletAddress.list.length">暂无钱包, 请点击按钮添加</div>
			<el-carousel :interval="5000" height="200px" indicator-position="outside" v-show="store.walletAddress.list.length">
				<el-carousel-item v-for="(item,index) in store.walletAddress.list" :key="index">
					<wallet-item :data="item" :myindex="index"></wallet-item>
				</el-carousel-item>
			</el-carousel>
		</el-row>

		<div class="text-right text" style="margin-top: 15px">
			©2017-2018 <a href="https://wkbminer.com/" target="_blank" style="color: #20a0ff;outline: none">WkbMiner.com</a> <a href="mailto:support@wkbminer.com" style="color: #20a0ff;outline: none">反馈</a>
		</div>

		<el-dialog width="90%" title="新增钱包地址" :visible.sync="dialogVisible">
			<el-input
					type="text"
					:rows="1"
					placeholder="请输入钱包地址"
					v-model="addr">
			</el-input>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="doConfirm(addr)">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import WalletItem from './components/WalletItem'
	import storage from './storage'
	import helper from './helper'
	import { Loading } from 'element-ui';

	export default {
		name: 'app',
		components: {
            WalletItem
		},
		data() {
			return {
				addr: '',
				appDetail : helper.appDetail,
				dialogVisible: false,
				store: {
					walletAddress: {
						list: []
					}
				}
			}
		},
		created(){
			this.init();
		},
		methods: {
			init(){
				storage.get('wkbWalletStorage').then(rs => {
					this.$set(this.$data, 'store', rs || {
							walletAddress: {
								list: []
							}
						})
				});
			},
            deleteList(index){
                this.$delete(this.store.walletAddress.list, index);
                this.setStore();
                return this.$message({
                    type: 'success',
                    message: '删除成功!'
                })
            },
			doConfirm(addr){
			    addr = addr.trim();
				if (addr === '') {
					return this.$message({
						type: 'warning',
						message: '错误, 地址不能为空'
					})
				}
				if (addr.indexOf("0x") !== 0) {
					return this.$message({
						type: 'warning',
						message: '错误, 地址格式不对'
					})
				}
				if (addr.length !== 42) {
					return this.$message({
						type: 'warning',
                        message: '错误, 地址格式不对'
					})
				}

				var hadAddr = false;
				var addrNum = 0;

                for (let v of this.store.walletAddress.list) {
                    if(v.address == addr){
                        hadAddr = true;
					}
					addrNum += 1;
                }

                if (addrNum > 7) {
                    return this.$message({
                        type: 'warning',
                        message: '错误, 最多添加8个钱包地址'
                    })
                }

                if(!hadAddr){
                    let loadingInstance = Loading.service({ fullscreen: true, lock:true });
					this.$http.get('https://wkbminer.com/api/account/'+addr).then(response => {
					    var amount,totaltrans,totaltransout,trans,lastupdate;
                        if(response.body.code == 0){
                            amount = response.body.msg.balance;
                            totaltrans = response.body.msg.totaltrans;
                            totaltransout = response.body.msg.transout;
                            trans = response.body.msg.trans;
                            lastupdate = Date.parse(new Date());
                        }else{
                            amount = 0;
                            totaltrans = 0;
                            totaltransout = 0;
                            trans = [];
                            lastupdate = 0;
                        }
                        this.store.walletAddress.list.push({
                            address: addr,
                            trans: trans,
                            totaltrans: totaltrans,
                            totaltransout: totaltransout,
                            amount: amount,
                            lastupdate: lastupdate,
                            showBody: false,
                            remind: ''
                        });
                        this.addr = '';
                        this.dialogVisible = false;
                        this.setStore();
                        loadingInstance.close();
                        return this.$message({
                            type: 'success',
                            message: '恭喜, 添加成功'
                        })
                    }, response => {
                        loadingInstance.close();
                        return this.$message({
                            type: 'error',
                            message: '错误, 添加失败'
                        })
                    });
				}else{
                    return this.$message({
                        type: 'warning',
                        message: '错误, 地址已经存在'
                    })
				}
			},

			setStore(){
				var store = this.store;
				for (let k in store) {
					var list = store[k].list;
					for (let v of list) {
						v.showBody = false
						if(v.remind) {
							v.remind = v.remind.toString();
						}
					}
				}

				storage.set({
                    wkbWalletStorage: store
				})
			},

            showInputArea(){
				this.dialogVisible = true
			}
		}
	}
</script>
