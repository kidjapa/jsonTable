# jsonTable
Inacabado.
Data: 06/02/2018;
V.: 1.0

        (instancie jQuery no escopo do html)

        Tabela a partir de um json;


        Arquivo Json exemplo:

        {
            "records": [    --> nome default para o array com os itens da tabela
            {
                "nome_coluna_aqui1": "I am record one", --> representa a coluna 1 (colocar na sequencia que irá aparecer na tela)
                "nome_coluna_aqui2": "Fetched by AJAX"
            }
            ]
        }

Defaults:

              var defaults = {
                  jsonUrl: "", //url do arquivo json
                  table: $(this), //obj tabela passado dinamicamente
                  setCollumCounts: false, //Indica que quero uma coluna com um contador
                  nameCollumCount: 'Id',
                  collunNames: [], //nome das colunas do arquivo json
                  limitPerPage: 10, //limite maximo default por paginas
                  limitsPages: [5,10,20,30,40,50,60,70,80,90,100], //array para setar no select input quantos itens mostra de cada vez
                  limitPage: false, //Indica se deve ou não seprar a tabela por paginas;
                  selectInserido: false //Indica se o select já foi inserido
              }
        
