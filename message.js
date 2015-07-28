
var net = require("net");
var port = 2000;
var fs = require('fs');

//make server

var server = net.createServer(function(connection){

	//Initial Setup
	console.log("Connection established!");
	connection.write("Message Box. " + '\n' );
	connection.write("1. Sign In " + '\n' );
	connection.write("2. Setup Account" + '\n' );
	var identity = 0;
	//takes data from the client
	connection.on('data',function(dataSentFromClient){
		var command = dataSentFromClient.toString().trim();
		//checks for valid command
			switch(command){
				case '1'://Signing in
					login();
					break;
				case '2':
					signup();
					break;
			}				
	})
	//Login Function
	var login = function login(){
		connection.write("Please Enter Your ID number" + '\n');
		connection.removeAllListeners('data');
			connection.on('data',function(input){
				var id = input.toString().trim();
				fs.readFile('messages.json','utf8',function(err,data){
					var idList = JSON.parse(data);
					idList.forEach(function(elem){
						if(id === elem.idd){
							identity = idList.indexOf(elem);//to get the ID
							connection.write("ID found!" + '\n' );
							connection.write("Please Enter Password " + '\n' );
								connection.removeAllListeners('data');
								connection.on('data',function(pass){
									var password = pass.toString().trim();
										if(password === elem.password){		
											displayMessage();
										}else{
											connection.write("Invalid Password! ");
											connection.write("Please Enter Valid Password " + '\n' );
										}
								})
						}else{
						// 	connection.write("Invalid ID" + '\n');
						// 	connection.write("Please Enter Your ID number" + '\n');
						}
				})
			})						
		})
	}
	var menuDisplay = function menuDisplay(){
		connection.write("1. List " + '\n' );
		connection.write("2. Add 'your message here' " + '\n' );
		connection.write("3. Delete 'messageid' " + '\n' );
	}
	//displaying, adding, deleting messages
	var displayMessage = function displayMessage(){
		menuDisplay();
		connection.removeAllListeners('data');
			connection.on('data',function(data){
				var com = data.toString().trim().split(" ");
				var command = com[0];
				console.log(command);
				switch(command){
					case 'List':
						fs.readFile('messages.json','utf8',function(err,data){
							var myMessageJSON= JSON.parse(data);
						
							var messages = myMessageJSON[identity].messages;
							connection.write("Message:" + '\n');
						
							messages.forEach(function(elem){
								connection.write(messages.indexOf(elem) + ". " + elem + '\n');
							})
						})
						menuDisplay();
						break;
					case 'Add':
						var input = com[1];
						fs.readFile('messages.json','utf8',function(err,data){
							var myMessageJSON= JSON.parse(data);
							myMessageJSON[identity].messages.push(input);
							var str = JSON.stringify(myMessageJSON);
							fs.writeFile('messages.json',str,function(err){
								if(err){
									console.log(err);
								}else{
									connection.write("added!" + '\n');
									menuDisplay();
								}
							})

						})
						break;
					case 'Delete':
						
						fs.readFile('messages.json','utf8',function(err,data){
							var myMessageJSON= JSON.parse(data);
							var messages = myMessageJSON[identity].messages;
							myMessageJSON[identity].messages.splice(com[1],1);//remove the message
							var str = JSON.stringify(myMessageJSON);
							fs.writeFile('messages.json',str,function(err){
								if(err){
									console.log(err);
								}else{
									connection.write("Deleted!" + '\n');
									menuDisplay();
								}
							})
						})
						
						break;



				}

			})

	}

var signup = function signup(){
	var username;
	var password;
	connection.removeAllListeners('data');
	//get ID
	connection.write("Please enter an ID number (100 onwards)" + '\n');
	connection.on('data',function(input){
		username = input.toString().trim();
		connection.removeAllListeners('data');
		connection.write("Please enter a password" + '\n');

		connection.on('data',function(input2){
			password = input2.toString().trim();
			console.log(username + password);
			fs.readFile('messages.json','utf8',function(err,data){
			var myMessageJSON= JSON.parse(data);
			var myObject = {"idd":username,"password":password,"messages":[]}

			myMessageJSON.push(myObject);
			console.log(myMessageJSON);
			var str = JSON.stringify(myMessageJSON);
				fs.writeFile('messages.json',str,function(err){
						if(err){
							console.log(err);
						}else{
							connection.write("Account Created!" + '\n')
						}
					})
				})
			
	
		})
		// connection.removeAllListeners('data');

	})
	//get Password
}	
	
})//server function



//listen to port
server.listen(port, function(){
	console.log("client connected");
	
})

