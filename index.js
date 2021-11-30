require('dotenv').config()
const express = require('express');
const app = express();
const http = require('http');
const https = require('https');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const fs = require('fs');

const PORT = process.argv[2]|| process.env.PORT || 2095;

app.use(express.static(__dirname + '/app'));
app.use(express.json({
	verify: (req, res, buf) => {
		req.rawBody = buf
	}
}));

io.on('connection', (socket) => {
	console.log('a user connected');
	//console.log(socket.handshake.auth);
	socket.on('update_data', (data) => {			
		if (socket.handshake.auth.id && socket.handshake.auth.token) {
			const ver_options = {
				hostname: 'api.facchini-pu.it',
				port: 443,
				path: '/checkstat',
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				}
			}
			const ver_data = JSON.stringify({
				id: socket.handshake.auth.id,
				token: socket.handshake.auth.token
			});
			const ver_req = https.request(ver_options, (ver_res) => {
				//console.log(`statusCode: ${ver_res.statusCode}`)
				ver_res.on('data', (d) => {
					//process.stdout.write(d);
					res_data = JSON.parse(d);
					if (res_data.ok === true) {
						fs.readFile(__dirname + '/app/json/data.json', 'utf8', (err, data_old) => {
							if (err) throw err;
							var json = JSON.parse(data);
							var data_old_obj = JSON.parse(data_old);
							Object.entries(json).forEach(entry => {
								const [indx, element] = entry;
								switch(element) { 														// switch case to be inpreved for each variable PS meaby is better to switch with index and than operator
									case '+':
										switch(indx) {
											case 'Ball':
												if (data_old_obj.Ball<3)
													data_old_obj[indx]++;
												break;
											case 'Strike':
												if (data_old_obj[indx]<2)
													data_old_obj[indx]++;
												break;
											case 'Out':
												if (data_old_obj[indx]<2)
													data_old_obj[indx]++;
												break;
											case 'Teams.Away.Score':
													data_old_obj.Teams.Away.Score++;
													data_old_obj.Int[data_old_obj.Inning].A++;
													break;
											case 'Teams.Home.Score':
													data_old_obj.Teams.Home.Score++;
													data_old_obj.Int[data_old_obj.Inning].H++;
													break;
											case 'Inning':
												data_old_obj.Inning++;
												data_old_obj.Int[data_old_obj.Inning] = {A: 0,H: 0};
												break;
											default:
												data_old_obj[indx]++;
												break;
										}
										break;
									case '-':
										switch(indx){
											case 'Teams.Home.Score':
												if(data_old_obj.Int[data_old_obj.Inning].H>0){
													data_old_obj.Int[data_old_obj.Inning].H--;
													data_old_obj.Teams.Home.Score--;
												}
												break;
											case 'Teams.Away.Score':
												if(data_old_obj.Int[data_old_obj.Inning].A>0){
													data_old_obj.Int[data_old_obj.Inning].A--;
													data_old_obj.Teams.Away.Score--;
												}
												break;
											case 'Inning':
												if(data_old_obj.Inning>1){
													delete data_old_obj.Int[data_old_obj.Inning];
													data_old_obj.Inning--;
												}
												break;
											default:
												if(data_old_obj[indx]>0)
													data_old_obj[indx]--;
												break;
										}										
										break;
									case '0':
										switch(indx) {	
											case 'Ball':
												data_old_obj[indx] = 0;
												break;
											case 'Strike':
												data_old_obj[indx] = 0;
												break;
											case 'Out':
												data_old_obj[indx] = 0;
												break;
											case 'Inning':
												data_old_obj[indx] = 1;
												data_old_obj.Int={1:{A:0,H:0}};
												break;
											case 'Teams.Away.Score':
												data_old_obj.Teams.Away.Score = 0;
												for (var i = 1; i <= data_old_obj.Inning; i++) {
													data_old_obj.Int[i].A = 0;
												}
												break;
											case 'Teams.Home.Score':
												data_old_obj.Teams.Home.Score = 0;
												for (var i = 1; i <= data_old_obj.Inning; i++) {
													data_old_obj.Int[i].H = 0;
												}
												break;
											default:
												break;
											
										}
										break;
									case "toggle":
										switch(indx){
											case '1':
												if(data_old_obj.Bases[1]==false)
													data_old_obj.Bases[1]=true;
												else
													data_old_obj.Bases[1]=false;
											break;
											case '2':
												if(data_old_obj.Bases[2]==false)
													data_old_obj.Bases[2]=true;
												else
													data_old_obj.Bases[2]=false;
											break;
											case '3':
												if(data_old_obj.Bases[3]==false)
													data_old_obj.Bases[3]=true;
												else
													data_old_obj.Bases[3]=false;
											break;
											case 'Auto_Change_Inning':
												data_old_obj.Bases[1]=false;
												data_old_obj.Bases[2]=false;
												data_old_obj.Bases[3]=false;
												data_old_obj.Ball=0;
												data_old_obj.Strike=0;
												data_old_obj.Out=0;
												if(data_old_obj.Arrow==1){
													data_old_obj.Arrow=2;
												}else{
													data_old_obj.Arrow=1;
													data_old_obj.Inning++;
													data_old_obj.Int[data_old_obj.Inning]={A:0,H:0};
												}
											break;
											case 'Reset_All':
												data_old_obj={"Teams": {"Away": {"Name": "AWAY","Score": 0,"Color": "#000000"},"Home": {"Name": "HOME","Score": 0,"Color": "#000000"}},"Ball": 0,"Strike": 0,"Out": 0,"Inning": 1,"Arrow": 1,"Bases": {"1": false,"2": false,"3": false},"Int": {"1": {"A": 0,"H": 0}}};
												
											break;
										}
										break;
										default:
											switch(indx){
												case 'Teams.Away.Name':
													data_old_obj.Teams.Away.Name=element;
													break;
												case 'Teams.Home.Name':
													data_old_obj.Teams.Home.Name=element;
													break;
												case 'Teams.Away.Color':
													data_old_obj.Teams.Away.Color=element;
													break;
												case 'Teams.Home.Color':
													data_old_obj.Teams.Home.Color=element;
													break;
												default:
													data_old_obj[indx]=element;
													break;
											}
											break;
									}
							});
							fs.writeFile(__dirname + '/app/json/data.json', JSON.stringify(data_old_obj, null, 4), (err) => {
								if (err) throw err;
							});
							socket.emit('update', data_old_obj);
						});
					}else{
						
					}
				});
			});
			ver_req.on('error', (e) => {
				console.error(e);
			});
			ver_req.write(ver_data);
			ver_req.end();
		}
	});
	socket.on('disconnect', () => {
		console.log('user disconnected');
	});
	fs.readFile('./app/json/data.json', function(err, data) {
		if (err) throw err;
		const json = JSON.parse(data);
		io.emit('update',json)
	});
});
server.listen(PORT, () => {
	console.log('listening on http://localhost:' + PORT);
});
