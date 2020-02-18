//configurando o servidor
const express = require("express")
const server = express()
//configurar o servidor para apresentar arquivos extras
server.use(express.static('public'))


//habilitar body do form
server.use(express.urlencoded({ extended: true }))

//configurar a conexão com banco de dados

const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: '391223',
    host: 'localhost',
    database: 'doe'
})



//configurando a template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true
})


// configurar apresentação da pagina
server.get("/", function (req, res) {
    
    db.query("SELECT * FROM donors", function(err, result){
        if(err) return res.send("Erro de banco de dados.")
        const donors = result.rows
        return res.render("index.html", { donors })

    })


    
})

server.post("/", function (req, res) {
    //pegar dados do formulário
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if (name == "" || email == "" || blood == "") {
        return res.send("Todos os campos são obrigatórios.")
    }
    //coloco valores dentro do banco de dados
    const query = `INSERT INTO donors ("name", "email","blood") 
                    VALUES ($1, $2, $3)`
    db.query(query, [name, email, blood], function(err){
        //fluxo de erro
        if(err) return res.send("Erro  no banco de dados.")

        //fluxo ideal
        return res.redirect("/")
    })


    

})



// ligar servidor e permitir acesso na porta 3000
server.listen(3000, function () {
    console.log("iniciei o servidor")
})

