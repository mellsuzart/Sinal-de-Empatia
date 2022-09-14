/*require('crypto')
.randomBytes(64)
.toString('hex')*/

//Configuraçoes

var express = require('express'); //carrega a biblioteca express
var app = express();

const sqlite3 = require('sqlite3').verbose(); //carrega a biblioteca sqlite3
const sqlite = require('sqlite'); //carrega a biblioteca sqlite

const fs = require('fs'); //carrega a biblioteca FileSystem

/* ================================================================================================================================*/
/* ================================================================================================================================*/
/* ================================================================================================================================*/
/* ================================================================================================================================*/
/* ================================================================================================================================*/
/* ================================================================================================================================*/

const multer = require('multer');



/* ================================================================================================================================*/
/* ================================================================================================================================*/
/* ================================================================================================================================*/
/* ================================================================================================================================*/
/* ================================================================================================================================*/
/* ================================================================================================================================*/


app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use(express.urlencoded()); //configuraçoes de roteamento
app.use(express.json()); //configura para ações JSON

/* ================================================================================================================================*/
/* ================================================================================================================================*/
/* ================================================================================================================================*/
/* ================================================================================================================================*/
/* ================================================================================================================================*/
/* ================================================================================================================================*/




//Roteamento - GET

app.get('/', function(req, res){ //direciona para o index
	fs.readFile("package-log.json", 'utf-8', function(err, data) {
		if (err){
			var existe = 0;
			res.render('index.ejs', {"existe": existe});
		} else {
			var existe = 1;
			res.render('index.ejs', {"existe": existe});
		}
	})
	 
});




app.get('/cad', function(req, res){ //direciona para o cadastro
	fs.readFile("package-log.json", 'utf-8', function(err, data) {
		if (err){
			var existe = 0;
			res.render('cadastro.ejs', {"existe": existe});
		} else {
			var existe = 1;
			res.render('cadastro.ejs', {"existe": existe});
		}
	})
});




app.get('/log', function(req, res){ //direciona para o login
	fs.readFile("package-log.json", 'utf-8', function(err, data) {
		if (err){
			var existe = 0;
			res.render('login.ejs', {"existe": existe});
		}
		else{ //USEM A PAGINA DE ERRO PARA REDIRECIONAR OS ERROS
			var erro = "ja esta logado";
			res.render("erro.ejs", {"erro": erro})
			console.log("Você já está logado")
		} 
	})
});




app.get('/forum', function(req, res){
	fs.readFile("package-log.json", 'utf-8', function(err, data) {
		if (err){
			var existe = 0;
			res.send("Faça Login para acessar esta área ;)");
		} else {
			var existe = 1;

			var db = new sqlite3.Database('usuario.db'); //cria ou abre o banco de dados
	
			db.serialize(function() {
		
				db.run("CREATE TABLE IF NOT EXISTS forum (user TEXT, mensage VARCHAR, titulo VARCHAR, id INTEGER PRYMARY KEY)"); //cria a tabela de forum

				

				db.all("SELECT * FROM forum", function(err, row){

					if(row === null || row == undefined){
						
						var fake = "Claudinho";
						var mensFake = "Adorei o site, muito interativo e fala sobre um assunto importante da nossa sociedade";

						db.run("INSERT INTO forum (user, mensage) VALUES (?, ?)", [fake, mensFake]);
					}

					console.log(row);
					console.log(" ================================================================================================================================");


					res.render('forum.ejs', {"existe": existe, "row": row});

				});

			});
			
		}
	})
});

app.get('/coment/:titulo', function(req, res){
	var existe = 1;

	var titulo = req.params.titulo;

	var db = new sqlite3.Database('usuario.db');

	db.serialize(function(){
		db.get("SELECT * FROM forum WHERE titulo = ?", [titulo], function(err, dados){

			db.get("SELECT user FROM forum WHERE titulo = ?", [titulo], function(erro, resposta){
				var usuario = dados?.user;
				

				db.get("SELECT * FROM usr_cad WHERE user = ?", [usuario], function(error, sucesso){
					//console.log("dados.user::::: ===== ", dados.user);
					//console.log(sucesso);

					db.run(`CREATE TABLE IF NOT EXISTS ${titulo} (user TEXT, comentario VARCHAR)`);

					db.all(`SELECT * FROM ${titulo}`, function(err, row){

						res.render('coment.ejs', {"existe": existe, "forum": dados, "usr": sucesso, "titulo": titulo, "row": row});
	
					});
					
				});
			});
		});
	});
});

app.post('/resposta', function(req, res){

	fs.readFile("package-log.json", 'utf-8', function(err, data) {

		var db = new sqlite3.Database('usuario.db'); //cria ou abre o banco de dados

		db.serialize(function() {
		
			db.run(`INSERT INTO ${req.body.titulo} (user, comentario) VALUES (?, ?)`, [data, req.body.resposta]);
			
			res.redirect(`/coment/${req.body.titulo}`);
		});

	});
});

app.post('/mensagem', function(req, res){

	fs.readFile("package-log.json", 'utf-8', function(err, data) {
		
		var db = new sqlite3.Database('usuario.db'); //cria ou abre o banco de dados

		db.serialize(function() {
		
			db.run("INSERT INTO forum (user, titulo, mensage) VALUES (?, ?, ?)", [data, req.body.titulo, req.body.mensage]);
	
			console.log(data, "\n", req.body.mensage);

			db.all("SELECT * FROM forum", function(err, sucesso){

				var existe = 1;

				res.render('forum.ejs', {"existe": existe, "row": sucesso});

			});
	
		});
	});
});


app.get('/perfil', function(req, res){
	fs.readFile("package-log.json", 'utf-8', function(err, data) {
		if (err){
			
			console.log("<================================================================================>");
			console.log(err);
			console.log("<================================================================================>");
			
			var existe = 0;
			res.send("Faça Login para acessar esta área ;)");

		} else {

			var existe = 1;
			console.log("<================================================================================>");
			console.log("Nome: ",data);
			console.log("<================================================================================>");

			var db = new sqlite3.Database('usuario.db');

			db.serialize(function(){

				db.get("SELECT * FROM usr_cad WHERE user = ?", [data], function(err, row){
					console.log("Dados: \n",row);
					if(err){
						res.send("Há algo de errado com seu usuário, sua conta foi desativada até que seja verificado");						
					} else {
						res.render('perfil.ejs', {"existe": existe, "foto": row.foto, "user": row.user, "email": row.email,"senha": row.senha});
					}
				});

			});


			
		}
	})
});





app.get('/acessibilidade', function(req, res){
	fs.readFile("package-log.json", 'utf-8', function(err, data) {
		if (err){
			var existe = 0;
			res.render('acessibilidade.ejs', {"existe": existe});
		} else {
			var existe = 1;
			res.render('acessibilidade.ejs', {"existe": existe});
		}
	})
});




app.get('/deslog', (req, res, next) => { //exclui o arquivo que armazena as informaçoes de login
	var file = "./package-log.json";
	fs.unlinkSync(file);
	var existe = 0;
	res.render("index.ejs", {"existe": existe});
});

app.get('/delete', function(req, res){
	fs.readFile("package-log.json", 'utf-8', function(err, data) {
		if (err){
			var erro = "usr";
			res.render("erro.ejs", {"erro": erro});
		} else {
			var db = new sqlite3.Database('usuario.db');

			db.serialize(function(){

				db.run("DELETE FROM usr_cad WHERE user = ?", [data]);

			});			
		}
		
	});
	var file = "./package-log.json";
	fs.unlinkSync(file);
	var existe = 0;
	res.render("index.ejs", {"existe": existe});
});




app.get('/check', (req, res, next) => { //checa as informações do usuario, caso precisarmos ver se esta logado
	
	fs.readFile("package-log.json", 'utf-8', function(err, data) {
		if (data == "root"){
			res.render("adm/painel.ejs", {"tabela": 0});
		} else {
			process.abort();
		}
		
		
	});
})

app.post('/checkdois', function(req, res) {

	var tabela = req.body.tabelas;

	var db = new sqlite3.Database('usuario.db');

	db.all(`SELECT * FROM ${tabela}`, function (err, row) {

		res.render("adm/painel.ejs", {"dados": row, "tabela": tabela});

	});

});

app.post('/deleteuser', function(req, res){
	var user = req.body.delete;

	console.log(user);

	var db = new sqlite3.Database('usuario.db');

	db.serialize(function(){
		db.run("DELETE FROM usr_cad WHERE user = ?", [user]);
		res.redirect('/check');
	});
});

app.post('/deletemensage', function(req, res){
	var user = req.body.delete;

	console.log(user);

	var db = new sqlite3.Database('usuario.db');

	db.serialize(function(){
		db.run("DELETE FROM forum WHERE titulo = ?", [user]);
		res.redirect('/check');
	});
});

/* ================================================================================================================================*/
/* ================================================================================================================================*/
/* ================================================================================================================================*/
/* ================================================================================================================================*/
/* ================================================================================================================================*/
/* ================================================================================================================================*/

// Configuração de armazenamento
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'public/')
	},
	filename: function (req, file, cb) {
		// Extração da extensão do arquivo original:
		const extensaoArquivo = file.originalname.split('.')[1];

		// Cria um código randômico que será o nome do arquivo
		const novoNomeArquivo = require('crypto')
		.randomBytes(10)
		.toString('hex');

		// Indica o novo nome do arquivo:
		cb(null, `${novoNomeArquivo}.${extensaoArquivo}`)
	}
});

const upload = multer({ storage });


//Roteamento - POST

app.post('/gravar', upload.single('foto'), function(req, res){
	fs.readFile("package-log.json", 'utf-8', function(err, data) {
		if (err){
			
			console.log("<================================================================================>");
			console.log(err);
			console.log("<================================================================================>");
			
			var existe = 0;

		} else {

			var existe = 1;
			
			var db = new sqlite3.Database('usuario.db');

			db.serialize(function(){

				db.get("SELECT * FROM usr_cad WHERE user = ?", [data], function(err, row){
					//console.log("Dados: \n",row);
					if(err){
						res.send("Há algo de errado com seu usuário, sua conta foi desativada até que seja verificado");						
					} else {
						if(req.file){
							var fileNovo = req.file.filename;
							
						} else {
							var fileNovo = row.foto;
						}
						if(req.body.user.senha === "" || req.body.user.senha == undefined){
							var senhaNova = row.senha;
						} else {
							var senhaNova = req.body.user.senha;
						}
						var email_rec = row.email;
						if(email_rec == req.body.user.email){
							db.run("UPDATE usr_cad SET senha = ?, foto = ?", [senhaNova, fileNovo]);
							//res.render('perfil.ejs', {"existe": existe, "foto": row.foto, "user": row.user, "email": row.email,"senha": row.senha});
							res.render('index.ejs', {"existe": existe});
						} else {
							db.all("SELECT * FROM usr_cad", function(err, row){
								/*console.log("<================================================================================>");
								console.log("<================================================================================>");
								console.log("<================================================================================>");
								console.log("Dados: \n",row);
								console.log("<================================================================================>");
								console.log("<================================================================================>");
								console.log("<================================================================================>");
								console.log("Email: ", req.body.user.email);*/
								if(err){
									res.send("Erro de servidor, por favor, tente novamente mais tarde!");						
								} else {
									for(var i = 0; i < row.length; i++){
										if(req.body.user.email == row[i].email){
											var erro = "Email ja cadastrado";
											res.render("erro.ejs", {"erro": erro});
										} else {
											//Clipboard
										}
									}
			
									db.run("UPDATE usr_cad SET email = ?, senha = ?, foto = ?", [req.body.user.email, senhaNova, fileNovo]);
			
									db.get("SELECT * FROM usr_cad WHERE user = ?", [data], function(err, row){
										//console.log("Dados: \n",row);
										if(err){
											res.send("Há algo de errado com seu usuário, sua conta foi desativada até que seja verificado");						
										} else {
											//res.render('perfil.ejs', {"existe": existe, "foto": row.foto, "user": row.user, "email": row.email,"senha": row.senha})
											res.render('index.ejs', {"existe": existe})
										}
									});
			
									
			
								}
							});
						}
					}
				});

				

			});


			
		}
	})
});

app.post('/', upload.single('foto'), function(req, res){ //recebe o cadastro


	/*console.log("<================================================================================>");
	console.log("user:", req.body.user.nome); //exibe o valor do campo de login nome
	console.log("senha:", req.body.user.senha); //exibe o valor do campo de login senha
	console.log("email:", req.body.user.email);
	console.log("confirm_senha:", req.body.user.confirm_senha);
	console.log(req.file.filename);
	console.log("<================================================================================>");*/

	if(req.body.user.senha == req.body.user.confirm_senha){
		var db = new sqlite3.Database('usuario.db'); //cria ou abre o banco de dados
	
	db.serialize(function() {
		
		db.run("CREATE TABLE IF NOT EXISTS usr_cad (user TEXT, senha VARCHAR, email VARCHAR, foto VARCHAR, adm INT)"); //cria a tabela de usuarios cadastrados
		db.get("SELECT adm FROM usr_cad WHERE user = 'root'", function(err, row) { //verifica se o root esta cadastrado
			
			if (row === undefined) { //caso nao esteja cadastrado, cadastra-o
				db.run("INSERT INTO usr_cad (user, senha, foto, adm) VALUES (?, ?, ?, ?)", ["root", "root@root", "ícone.png", 1]);
			}
		})

		db.get("SELECT adm FROM usr_cad WHERE user = ?", [req.body.user.nome], function (err, row) { 
			if(row === undefined){

				db.get("SELECT adm FROM usr_cad WHERE email = ?", [req.body.user.email], function (err, row) {

					if(row === undefined){

						if(req.file){
							var fileNovo = req.file.filename;
						} else {
							var fileNovo = "ícone.png";
						}
							
						db.run("INSERT INTO usr_cad (user, senha, email, foto, adm) VALUES (?, ?, ?, ?, ?)", [req.body.user.nome, req.body.user.senha, req.body.user.email, fileNovo, 0], function (err, row){
							if(err){
								console.log("<================================================================================>");
								console.log("Erro ao cadastrar", err);
								console.log("<================================================================================>");
							}
						});

						fs.writeFile(
							"./package-log.json", 
							req.body.user.nome,
						function(err) {
							if (err) { //exibe possiveis erros ao criar o arquivo
								console.log(err);
							} else {
								console.log("arquivo criado");
							}
						});
							
						

						db.all("SELECT * FROM usr_cad", function (err, row) { //exibe se o usuario foi cadastrado, assim como todos os registros da tabela
							console.log(err, row);
						});

						
						
						fs.readFile("package-log.json", 'utf-8', function(err, data) {
							if (err){
								var existe = 0;
								res.render('index.ejs', {"existe": existe});
							} else {
								var existe = 1;
								res.render('index.ejs', {"existe": existe});
							}
						});
					} else {
						var erro = "falha no cadastro";
						res.render("erro.ejs", {"erro": erro});
					}

				});
			} else {
				var erro = "falha no cadastro";
				res.render("erro.ejs", {"erro": erro});
			}
		
		});
	});
	}
	else{
		var erro = "senhas diferentes";
		res.render("erro.ejs", {"erro": erro});
	}
	
	
});





app.post('/logado', function(req, res){ //recebe o login
	
	
	var db = new sqlite3.Database('usuario.db'); //abre o banco de dados
	
	db.get("SELECT * FROM usr_cad WHERE user = ? AND senha = ?", [req.body.user.nomeLg, req.body.user.senhaLg], function (err, row) { //busca os dados do usuario que esta tentando logar
		//console.log(err, row); //exibe os dados e possiveis erros
		
		if (row === undefined) {//caso nao retorne informaçoes, significa q o login esta incorreto
			console.log("Credenciais incorreta");
			var erro = "credenciais";
			res.render("erro.ejs", {"erro": erro}); //TRATAR
		} else {
			console.log("Logado"); 

			//criar arquivo .json com as credenciais para se necessario
			fs.writeFile("./package-log.json", 
				req.body.user.nomeLg,
				function(err) {
				if (err) { //exibe possiveis erros ao criar o arquivo
					console.log(err);
				} else {
					console.log("arquivo criado");

					fs.readFile("package-log.json", 'utf-8', function(err, data) {
						if (data == "root"){
							console.log("<================================================================================>");
							console.log("Olá, adm");
							console.log("<================================================================================>");
							res.render("adm/index.ejs");
						} else {
							var existe = 1;
							res.render("index.ejs", {"existe": existe}); //renderiza o index
						}
					});
					
					
				}
			});
		}
	});
});

/* ================================================================================================================================*/
/* ================================================================================================================================*/
/* ================================================================================================================================*/
/* ================================================================================================================================*/
/* ================================================================================================================================*/
/* ================================================================================================================================*/


//Configuraçoes de porta

var porta = 3000;
app.listen(porta, function(){
	console.log("Servidor rodando");
});