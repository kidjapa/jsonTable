/*
    Autor: Bruno luzi K.;
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
    
*/


(function($) {
    
    
    $.fn.jsonTable = function(options){
        
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
        
        var settings = $.extend({}, defaults ,options);
        
        
        /* Parte 1 - Verificar se existe o caminho para o arquivo ajax*/
        if (settings.jsonUrl != ""){
            delRowsTable();
            callAjax();
        }else{
            console.log("Você esqueceu do caminho para o jsonUrl ('caminho json não especificado')");
        }
        
        
        /*
            Pegar nome das colunas do settings.records
            Return: um array com os nomes da colunas
        */
        function gettingCollumNames(obj){        
            var array = [];
            if(typeof obj != "undefined" && obj != null && obj.length > 0){
            array = Object.keys(obj[0]);
            }        
            return array;
        }

        /*
            Inserir select na tabela
            return: nada;
        */
        function insertSelect(){
            //Avisar ao ajax que o select foi inserido e precisa delimitar a quantidade de linhas a serem exibidas
                    
            var objSelect = $('<select>').attr('id','selectJsonTable');
            var objOption = $('<option>').attr('value',settings.limitPerPage).text(settings.limitPerPage);
            objSelect.append(objOption);

            for (i = 0;i < settings.limitsPages.length;i++){
                
                if (settings.limitsPages[i] != settings.limitPerPage){
                    objOption = $('<option>').attr('value',settings.limitsPages[i]).text(settings.limitsPages[i]);
                    objSelect.append(objOption);
                }            
            }


            settings.table.parent().prepend(objSelect);
            var objSpan = $('<span>').attr('id','spanJasonTable').text('Quantidade por paginas: ');
            settings.table.parent().prepend(objSpan);

            $("#selectJsonTable" ).bind( "change", function( event ) {
                //console.log($( "#selectJsonTable" ).val());
                delRowsTable();
                callAjax($( "#selectJsonTable" ).val());
            });
        }
        
        
        function delRowsTable(){
            settings.table.find('tr').remove();
        }
        
        
        /*
            Inserir linhas dentro da tabela
            Return: nada;
        */
        function insertRows(data, limitPages){
            delRowsTable();
            
            /*  Inserir Cabeçalho */
            var objLinha = $('<tr>').attr('id','linhaTopoJsonTable');
            
            if(settings.setCollumCounts === true){
                var objTitulo = $('<th>').text(upperFirstCase(settings.nameCollumCount)).addClass('linhaTabela');
                objLinha.append(objTitulo);
            }
            
            for (i = 0; i < settings.collunNames.length; i++){
                var objTitulo = $('<th>').text(upperFirstCase(settings.collunNames[i])).addClass('linhaTabela');
                objLinha.append(objTitulo);
            }
            $(settings.table).append(objLinha);
            
            if(limitPages != undefined){
                settings.limitPerPage = limitPages;
            }
            
            
            /* Para cada linha dentro de data.records (data é uma variavel vindo do ajax quando em sucesso) */
            $.each(data.records, function(index, value){
                //se index é maior que o numero de itens por pagina e limite é setado como true então:
                if ((index+1) > settings.limitPerPage && settings.limitPage === true){ 
                    return false;
                }else{
                    objLinha = $('<tr>').attr('id','linhaJsonTable');
                    
                    if(settings.setCollumCounts === true){
                        var objTitulo = $('<td>').text(index+1).addClass('linhaJsonTable');
                        objLinha.append(objTitulo);
                    }
                    
                    for (i = 0; i < settings.collunNames.length; i++){
                        objLinha.append($('<td>').text(value[settings.collunNames[i]]));
                    }
                    $(settings.table).append(objLinha);
                }
            });
            
        }/* Fim insertRows(data) */
        
        
        /*
            Chamar ajax;
            Return: nada;
        */
        function callAjax(limitPages){ 
            
            $.ajax({
            dataType: 'json',
            url: settings.jsonUrl,
            success: function(data){
                
                if(settings.collunNames.length === 0){
                        settings.collunNames = gettingCollumNames(data.records); 
                }
                
                /* Se já não tiver sido inserido o select quant pages */
                if ($(settings.table).parent().find('select').length === 0){
                    //Se tiver mais itens que o valor default de itens para mostrar (setting.limitPerPages): constroi o select
                    if (data.records.length > settings.limitPerPage){ 
                        insertSelect();
                        settings.limitPage = true;
                    }                    
                }else if($(settings.table).parent().find('select').length >= 0){
                    settings.limitPage = true;
                }
                                
                /* Inserir linhas dentro da tabela se houver colunas dentro do jSon */
                if(typeof settings.collunNames != "undefined" && settings.collunNames != null && settings.collunNames.length > 0){ //se o arquivo possuir mesmo colunas entra;
                    insertRows(data, limitPages);
                }
                
            },//END SUCESS AJAX
            statusCode: {
                404: function() {
                  console.log( "Arquivo não pode ser encontrado (jsonTable). Fale com um administrador do site. (erro 404 função ajax)" );
                }
            }
            }); /* ---> FIM $.ajax() ---- */
        }
        
        
        function upperFirstCase(palavra){
            
            var _palavra = palavra;
            palavra = _palavra[0].toUpperCase();
            for (f =1; f < _palavra.length;f++){
                palavra += _palavra[f];
            }
            
            return palavra;
        }
        
        
    };//FIM jsonTable
    
    

    
    
    
})(jQuery);
