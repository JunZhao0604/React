
import React, { PropTypes,Component } from 'react';
import { 
	Col,
	Row ,
	Icon, 
	Table, 
	Input, 
	Menu, 
	Button, 
	Pagination,
	Dropdown,
	Popconfirm, 
} from 'antd'

import ACell from './aCell';
import appData from './../../../assert/Ajax'
import '../../../App.css'

const { Column, ColumnGroup } = Table;
export default class pointTable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataSource: [],
			pageCtrl: true,
			comm_name:0,
			activity_no:0,
			title:'',
			count: 1,
			pageNum:1,
			total:0,
		};
		// 编号	手机	姓名	性别	IC卡号	职业	业主/租客	操作

		this.columns = [
			{
				title: '编号',
				colSpan:1,
				dataIndex: 'id',
				render:(text,record,index)=>{
					return (
						<text>{index+1}</text>
					)
				}
			},
			{
				title: '手机',
				colSpan:1,
				dataIndex: 'mobile',
			}, 
			{
				title: '姓名',
				colSpan:1,
				dataIndex: 'name',
			}, 
			{
				title: '性别',
				colSpan:1,
				dataIndex: 'gender',
			},
			{
				title: 'IC卡号',
				colSpan:1,
				dataIndex: 'ic_card',
			},
			{
				title: '职业',
				colSpan:1,
				dataIndex: 'occupation',
			},
			{
				title: '业主/租客',
				colSpan:1,
				dataIndex: 'type',
				render:(text)=>{
					let type = ''
					if(text == "Y"){
						type="业主"
					} else if(text = "Z"){
						type="租客"
					}
					return (
						<text>{type}</text>
					)
				}
			},
			{
				colSpan:1,
				title:"操作",
				key:"action",
				render:(text, record)=>{
					let state = '签到';
					let disable = false;
					 if(record.status_flag == 1){
						state = "已签到"
						disable = "true"
					}
					return(
						<span>
							<Button disabled={disable} onClick={()=>this._volSign(text)}>{state}</Button>
						</span>
					)
				}
			},
		];
		this.activeMess = null;
		this.userMess = null;
	}

	componentWillMount(){
		let mess = this.props.message.message
		this.activeMess = mess;
		this.setState({
			activity_no:  mess.activity_no,
			title: mess.title,
		})
		appData._Storage('get','userMess',(res) => {
			this.userMess = res;
			this._login(res,mess)
			this.setState({
				comm_name: res.comm_name,
			})
		})
	}

	_print(){
		window.print();
	}

	
	_login(data,mess){
		let afteruri = 'activity/check'
		let body = {
			comm_code: mess.comm_code,
			activity_no:mess.activity_no,
		}

		appData._dataPost(afteruri, body, (res) =>{
			let pageSum = Math.ceil(res.length/res.per_page)
			let len = res.length;
			this.setState({
				pageCtrl: true,
				dataSource: res,
				total: len,
				count:len,
			})
		})
	}

	_jump(nextPage,mess){
		if(nextPage == 'back'){
			this.props.Router(this.props.message.historyPage,mess,this.props.message.nextPage)
		}else {
			this.props.Router(nextPage,mess,this.props.message.nextPage)
		}
	}

	_showPage(){
		if(this.state.pageCtrl){
			<Table bordered columns={this.columns} dataSource={this.state.dataSource} />
		} else {

		}
	}

	_volSign(obj){
		let body ={
			"wx_id": obj.wx_id,
			"activity_no": Number(this.activeMess.activity_no),
			"comm_code": this.activeMess.comm_code,
		}
		let afteruri = 'volunteer/sign'
		appData._dataPost(afteruri,body,(res)=>{
			if(res){
				this._login(this.userMess,this.activeMess)
			}
		} )
	}

	//分页器activity/list?page=num
	_pageChange(pageNumber){
		let userMess = this.userMess;
		let afteruri = 'activity/check?page=' + pageNumber ;
		let body = {
			 "comm_code": userMess.comm_code
		}
		appData._dataPost(afteruri,body,(res) => {
			let pageSum = Math.ceil(res.total/res.per_page)
			let data = res.data;
			let len = data.length;
			this.setState({
				total:res.total,
				dataSource: data,
				count:len,
				pageNum:pageNumber
			})
		})
	}

	render() {
		return (
			<div style={{ background: '#fff', padding: 24, margin: 0, minHeight: 80 }}>
				<Row type="flex" justify="space-between" gutter={1}>
					<Col span={2} className="printHidden">
						<Button style={{marginBottom: 20}} onClick={()=>this._jump('back')}>返回</Button>
					</Col>

					<Col span={2} className="printHidden">
							<Button onClick={() => this._print()}>打印</Button>
					</Col>
				</Row>
				<Row  style={{marginBottom: 20}}>
					<Col span={8}>活动编号：{this.state.activity_no}</Col>
					<Col span={8}>活动主题：{this.state.title}</Col>
				</Row>
				<Table bordered columns={this.columns} dataSource={this.state.dataSource}/>
				{/* <Row type="flex" justify="end"> */}
					{/* <Pagination showQuickJumper defaultCurrent={1} current={this.state.pageNum} total={this.state.total} onChange={this._pageChange.bind(this)} /> */}
				{/* </Row> */}
			</div>
		);
	}
}