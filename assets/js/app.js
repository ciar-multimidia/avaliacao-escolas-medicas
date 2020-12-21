jQuery(document).ready(function($) {
    var janela = $(window),
        janelaWidth = $(window).width();
	
	/////////////////////// LOADER
	window.FakeLoader.init( { auto_hide: true } );
    
    /////////////////////// NOTA RODAPE
    var focusableElementsString = "a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]",
        focusedElementBeforeModal,
        modais = $('.modal'),
        overlay = $('.modalOverlay'),
        main = $('main'),
        body = $('body');


    $('.nota').click(function(e) {
        var numNota = $(this).data('nota');
        console.log(numNota);
        var modalAberto = modais.filter(function() {
            return $(this).data('nota') == numNota
        });
        // console.log(modalAberto); 
        showModal(modalAberto);
    });

    $('.fechar_nota').click(function(e) {
        hideModal();
    });

    modais.keydown(function(event) {
        trapTabKey($(this), event);
    })

    modais.keydown(function(event) {
        trapEscapeKey($(this), event);
    })


    function trapEscapeKey(obj, evt) {
        // if escape pressed
        if (evt.which == 27) {

            // get list of all children elements in given object
            var o = obj.find('*');

            // get list of focusable items
            var cancelElement;
            cancelElement = o.filter(".fechar_nota")

            // close the modal window
            cancelElement.click();
            evt.preventDefault();
        }

    }

    function trapTabKey(obj, evt) {

        // if tab or shift-tab pressed
        if (evt.which == 9) {

            // get list of all children elements in given object
            var o = obj.find('*');

            // get list of focusable items
            var focusableItems;
            focusableItems = o.filter(focusableElementsString).filter(':visible')

            // get currently focused item
            var focusedItem;
            focusedItem = $(':focus');

            // get the number of focusable items
            var numberOfFocusableItems;
            numberOfFocusableItems = focusableItems.length

            // get the index of the currently focused item
            var focusedItemIndex;
            focusedItemIndex = focusableItems.index(focusedItem);

            if (evt.shiftKey) {
                //back tab
                // if focused on first item and user preses back-tab, go to the last focusable item
                if (focusedItemIndex == 0) {
                    focusableItems.get(numberOfFocusableItems - 1).focus();
                    evt.preventDefault();
                }

            } else {
                //forward tab
                // if focused on the last item and user preses tab, go to the first focusable item
                if (focusedItemIndex == numberOfFocusableItems - 1) {
                    focusableItems.get(0).focus();
                    evt.preventDefault();
                }
            }
        }

    }

    function setInitialFocusModal(obj) {
        // get list of all children elements in given object
        var o = obj.find('*');

        // set focus to first focusable item
        var focusableItems;
        focusableItems = o.filter(focusableElementsString).filter(':visible').first().focus();

    }

    function setFocusToFirstItemInModal(obj){
        // get list of all children elements in given object
        var o = obj.find('*');

        // set the focus to the first keyboard focusable item
        o.filter(focusableElementsString).filter(':visible').first().focus();
    }

    function showModal(obj) {
        main.attr('aria-hidden', 'true'); // mark the main page as hidden
        overlay.css('display', 'block'); // insert an overlay to prevent clicking and make a visual change to indicate the main apge is not available
        obj.css('display', 'block'); // make the modal window visible
        obj.attr('aria-hidden', 'false'); // mark the modal window as visible

        // attach a listener to redirect the tab to the modal window if the user somehow gets out of the modal window
        body.on('focusin','main',function() {
            setFocusToFirstItemInModal(obj);
        })

        // save current focus
        focusedElementBeforeModal = $(':focus');

        setFocusToFirstItemInModal(obj);
    }

    function hideModal() {
        overlay.css('display', 'none'); // remove the overlay in order to make the main screen available again
        modais.css('display', 'none'); // hide the modal window
        modais.attr('aria-hidden', 'true'); // mark the modal window as hidden
        main.attr('aria-hidden', 'false'); // mark the main page as visible

        // remove the listener which redirects tab keys in the main content area to the modal
        body.off('focusin','main');

        // set focus back to element that had it before the modal was opened
        focusedElementBeforeModal.focus();
    }


    /////////////////////// JUMPS
    $(document).on('click', 'a[href^="#"]', function (event) {
        event.preventDefault();

        $('html, body').animate({
            scrollTop: $($.attr(this, 'href')).offset().top
        }, 500);
    });





    /* @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/
    /* @@@@@@@@@@@@@@@@@@@@ FORMULARIO @@@@@@@@@@@@@@@@@@@@*/
    /* @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/


    var $secoesFormulario = $("#formulario section");
    var $rodaResultado = $("#resultado-roda");
    var $progressoFill = $("#progresso-preenchimento");
    var perguntaAtual = 0;
    var secaoPreenchida = false;
    var autofill__INSTITUICAO = (function(){
        if (localStorage.getItem("avalEscolasMedicas__INSTITUICAO")) {
            return JSON.parse(localStorage.getItem("avalEscolasMedicas__INSTITUICAO"));
        }
        else{
            return {};
        }
    })();
    var autofill__PARTICIPANTES = (function(){
        if (localStorage.getItem("avalEscolasMedicas__PARTICIPANTES")) {
            return JSON.parse(localStorage.getItem("avalEscolasMedicas__PARTICIPANTES"));
        } else {
            return {};
        }
    })();
    var autofill__PERGUNTAS = (function(){
        if (localStorage.getItem("avalEscolasMedicas__PERGUNTAS")) {
            return JSON.parse(localStorage.getItem("avalEscolasMedicas__PERGUNTAS"));
        } else {
            return {};
        }
    })();


    $("#formulario button").on('click', function(event) {
        event.preventDefault();
    });

    var checarInputsPreenchidos = function($inputs){
        var nInputs = $inputs.length;
        var inputsPreenchidos = 0;
        $inputs.each(function(index, el) {
            var valInput = $.trim($(el).val());
            if (valInput.length !== 0) {
                inputsPreenchidos++;
            }
        });
        console.log("preenchidos: "+inputsPreenchidos+"; total: "+nInputs);
        if (inputsPreenchidos === nInputs) {
            return true;
        } else{
            return false;
        }
    }

    var habilitarBtAvancar = function($bt, condicao){
        if (condicao) {
            $bt.removeAttr('disabled');
            secaoPreenchida = true;
        }
        else{
            $bt.attr('disabled', 'disabled');
            secaoPreenchida = false;
        }
    }

    var gerarTextoStatusParticipantes = function(numero){return numero+" participante"+(numero > 1 ? "s" : "")};

    

    $secoesFormulario.each(function(index, el) {
        var $inputsTexto = $(el).find("input[type='text'], textarea");
        var $btAvancar;

        if ($(el).is(":last-child")) {
            $btAvancar = $("#bt-resultado");
        } else{
            $btAvancar = $(el).find(".bt-avancar");
        }


        /* @@@@@@@@@@@@  Inscrição da Instituição  @@@@@@@@@@@@ */
        if ($(el).is("#inscricao-instituicao")) {
            $inputsTexto
            .on('input', function(event) {
                var todosInputsPreenchidos = checarInputsPreenchidos($inputsTexto);
                habilitarBtAvancar($btAvancar, todosInputsPreenchidos);
            })
            .on("blur", function(event) {
                autofill__INSTITUICAO[$(this).attr("data-nome")] = $(this).val();
                localStorage.setItem("avalEscolasMedicas__INSTITUICAO", JSON.stringify(autofill__INSTITUICAO));
                console.log(autofill__INSTITUICAO);
            });

            if (localStorage.getItem("avalEscolasMedicas__INSTITUICAO")) {
                console.log("autofill da instituicao existe!");
                $inputsTexto.each(function(index, el) {
                    if (autofill__INSTITUICAO[$(el).attr("data-nome")]) {
                        $(el).val(autofill__INSTITUICAO[$(el).attr("data-nome")]);
                    }
                });
                $inputsTexto.trigger("input");
            }
        } 

        /* @@@@@@@@@@@@  Inscrição dos Participantes  @@@@@@@@@@@@ */
        else if ($(el).is("#inscricao-participantes")) {
            var $sectionParticipantes = $(el);
            var $statusParticipantes = $("#status-participantes");
            var minimoParticipantes = parseInt($statusParticipantes.attr("data-minimo-participantes"));
            var $listasParticipantes = $sectionParticipantes.find(".participantes");
            var $participantes = $sectionParticipantes.find(".participantes li");
            var nParticipantes = $participantes.length;
            var $btsAdicionarParticipante = $sectionParticipantes.find(".btAddParticipante");
            var $btsRemoverParticipante = $sectionParticipantes.find(".removerParticipante");

            $statusParticipantes
            .find(".minimo")
            .text(minimoParticipantes)
            .end()
            .find(".atual")
            .text(gerarTextoStatusParticipantes($participantes.length));


            var atualizarParticipantes = function(){
                $participantes = $sectionParticipantes.find(".participantes li");
                nParticipantes = $participantes.length;
                $inputsTexto = $sectionParticipantes.find("input[type='text'], textarea");
                $statusParticipantes.find(".atual").text(gerarTextoStatusParticipantes($participantes.length));
                $inputsTexto.eq(0).trigger("input");
            }


            $btsRemoverParticipante.on('click', function(event) {
                if ($(this).closest('.participantes').children().length > 1) {
                    var indexParticipante = $(this).closest(".participantes").children().index($(this).closest("li.grupo"));
                    var nomeListaParticipante = $(this).closest(".participantes").attr('data-nome') 
                    autofill__PARTICIPANTES[nomeListaParticipante].splice(indexParticipante, 1);
                    $(this).closest("li.grupo").remove();
                    atualizarParticipantes();

                }
            });

            $btsAdicionarParticipante.on('click', function(event) {
                var $listaNovoParticipante = $listasParticipantes.filter("[data-nome='"+$(this).attr("data-for")+"']");
                var $participanteClone = $listaNovoParticipante.find("li").last().clone(true);
                $participanteClone.find("input").each(function(index, el) {
                    $(el).val("");
                });
                $participanteClone.insertAfter($listaNovoParticipante.find("li").last());


                var novoParticipanteAutofill = {}
                $participanteClone.find("input").each(function(index, el) {
                    novoParticipanteAutofill[$(el).attr("data-nome")] = "";
                });
                autofill__PARTICIPANTES[$(this).attr("data-for")].push(novoParticipanteAutofill);

                console.log($(this).attr("data-for")+" agora com mais um participante");


                atualizarParticipantes();
            });

            $(el).on('aparece', function(event) {
                atualizarParticipantes();
            });


            $listasParticipantes.each(function(index, el) {

                var $lista = $(el);
                var categoriaLista = $lista.attr("data-nome");

                if (autofill__PARTICIPANTES[categoriaLista]) {

                    console.log(categoriaLista + " já existe no autofill");
                    var $participantes = $lista.children();
                    var whileLimite = 0;
                    while ($participantes.length < autofill__PARTICIPANTES[categoriaLista].length && whileLimite<20){
                        whileLimite++;
                        if (whileLimite === 20) {console.error(categoriaLista+" estourou o limite do loop while!")}
                        console.log(whileLimite+": a lista ainda tem "+$participantes.length+" itens. Precisa de "+autofill__PARTICIPANTES[categoriaLista].length);
                        var $participanteClone = $lista.find("li").last().clone(true);
                        $participanteClone.find("input").each(function(index, el) {
                            $(el).val("");
                        });
                        $participanteClone.insertAfter($lista.find("li").last());
                        $lista = $(el);
                        $participantes = $lista.children();
                        console.log(autofill__PARTICIPANTES);
                    }
                    $.each(autofill__PARTICIPANTES[categoriaLista], function(index2, val) {
                        $lista.children().eq(index2).find("input").each(function(index3, el2) {
                            $(el2).val(val[$(el2).attr("data-nome")]);
                        });
                    });
                } else{
                    console.log(categoriaLista + " não existe no autofill! Criando.");

                    autofill__PARTICIPANTES[categoriaLista] = [];
                    autofill__PARTICIPANTES[categoriaLista].push(new Object());
                    $lista.children().first().find("input").each(function(index, el2) {
                        autofill__PARTICIPANTES[categoriaLista][0][$(el2).attr("data-nome")] = "";
                    });
                    console.log(autofill__PARTICIPANTES);
                }
            });

            atualizarParticipantes();

            $inputsTexto
            .on('input', function(event) {
                var todosInputsPreenchidos = checarInputsPreenchidos($inputsTexto);
                habilitarBtAvancar($btAvancar, (nParticipantes >= minimoParticipantes && todosInputsPreenchidos));
            })
            .on("blur", function(event) {
                var categoriaParticipante = $(this).closest("ul.participantes").attr("data-nome");
                var indexListaParticipante = $(this).closest("ul.participantes").children().index($(this).closest("li.grupo"));
                var thisNome = $(this).attr("data-nome");
                
                autofill__PARTICIPANTES
                [categoriaParticipante]
                [indexListaParticipante]
                [thisNome]
                = $(this).val();
                localStorage.setItem("avalEscolasMedicas__PARTICIPANTES", JSON.stringify(autofill__PARTICIPANTES));
                console.log(autofill__PARTICIPANTES);
            });
        }

        /* @@@@@@@@@@@@  Inscrição das Perguntas  @@@@@@@@@@@@ */
         else{
            var $secaoPergunta = $(el);
            var $opcoesPerguntas = $secaoPergunta.find("input[type='radio']");
            var algumaOpcaoEscolhida = false;
            var inputsPreenchidos = checarInputsPreenchidos($inputsTexto);

            if (autofill__PERGUNTAS[$(el).attr("id")]) {
                var opcaoEscolhida = autofill__PERGUNTAS[$(el).attr("id")]["opcaoEscolhida"];
                if (opcaoEscolhida > 0) {
                    $opcoesPerguntas.eq(opcaoEscolhida-1).prop('checked', 'true');
                }
                $inputsTexto.filter(".input_justificativa").val(autofill__PERGUNTAS[$(el).attr("id")]["justificativa"]);
                $inputsTexto.filter(".input_evidencias").val(autofill__PERGUNTAS[$(el).attr("id")]["evidencias"]);
            } else{
                autofill__PERGUNTAS[$(el).attr("id")] = {
                    "opcaoEscolhida": 0,
                    "justificativa": "",
                    "evidencias": ""
                }
            }
            $opcoesPerguntas.on('input', function(event) {
                algumaOpcaoEscolhida = true;
                autofill__PERGUNTAS[$(el).attr("id")]["opcaoEscolhida"] = $opcoesPerguntas.index($opcoesPerguntas.filter(":checked"))+1;
                localStorage.setItem("avalEscolasMedicas__PERGUNTAS", JSON.stringify(autofill__PERGUNTAS));
            });

            $inputsTexto.on('blur', function(event) {
                if ($(this).is('.input_justificativa')) {
                    autofill__PERGUNTAS[$(el).attr("id")]["justificativa"] = $(this).val();
                }
                if ($(this).is('.input_evidencias')) {
                    autofill__PERGUNTAS[$(el).attr("id")]["evidencias"] = $(this).val();
                }
                localStorage.setItem("avalEscolasMedicas__PERGUNTAS", JSON.stringify(autofill__PERGUNTAS));
            });

            var $todosInputs = $opcoesPerguntas.add($inputsTexto);

            $todosInputs.on('input', function(event) {
                inputsPreenchidos = checarInputsPreenchidos($inputsTexto);
                habilitarBtAvancar($btAvancar, (algumaOpcaoEscolhida && inputsPreenchidos));
            });
         }
    });




    $secoesFormulario
    .find("nav button")
    .on('click', function(event) {
        if ((secaoPreenchida && $(this).is('.bt-avancar')) || $(this).is('.bt-voltar')) {
            $(this).closest("section").removeClass('visivel');

            var $proxSecao;

            if ($(this).is('.bt-avancar')) {
               $proxSecao =  $(this).closest("section").next();
            } else if ($(this).is('.bt-voltar')) {
               $proxSecao =  $(this).closest("section").prev();
            }

            perguntaAtual = $secoesFormulario.index($proxSecao);
            $progressoFill.find(".progresso").css("width", ( (100/$secoesFormulario.length)*(perguntaAtual+1) ).toFixed(2)+"%" );
            $proxSecao.addClass('visivel').find("input").eq(0).trigger("input");
            if ($proxSecao.is("#inscricao-participantes")) {
                $proxSecao.trigger("aparece");
            }
            $("html, body").stop().animate({"scrollTop": 0}, 300);
        }
    });

    var cheatPreencherTudo = function(){
        $secoesFormulario.each(function(index, el) {

            console.log("Seção: "+$(el).attr("id"));

            if ($(el).is("#inscricao-participantes")) {
                var $listaDocentes = $(el).find(".participantes[data-nome='lista-docentes']");
                for (var i = 0; i < 7; i++) {
                    var $cloneParticipante = $listaDocentes.find("li.grupo").eq(0).clone(true);
                    $listaDocentes.append($cloneParticipante);
                }

                $(el).trigger("aparece");
            }
            var $inputsTexto = $(el).find("input[type='text'], textarea");
            $inputsTexto.each(function(index, el) {
                $(el).val("Texto de teste");
            });
            if ($(el).is(".pergunta")) {
                var $opcoesPergunta = $(el).find("input[type='radio']");
                var nOpcaoAleatoria = Math.floor(Math.random() * $opcoesPergunta.length);
                $opcoesPergunta.eq(nOpcaoAleatoria).prop("checked", "true");
                console.log("Das "+$opcoesPergunta.length+" opções, escolheu o "+(nOpcaoAleatoria+1));
            }


        })

        $secoesFormulario.eq(perguntaAtual).find("input").trigger("input");
    }


    var $btResultado = $("#bt-resultado");
    var $btSalvar = $("#salvar");
    var $btRevisar = $("#revisar");
    var $graficoRoda = $("#resultado-roda");
    var $resultadoInstituicao = $("#resultado .instituicao");
    var $resultadoParticipantes = $("#resultado .participantes");
    var $resultadoPerguntas = $("#resultado .perguntas");


    $btResultado.on('click', function(event) {

        // gerar data e hora de geração do relatório
        var dataAtual = new Date();
        var meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
        $("#timestamp").find(".tempo").text(
            dataAtual.getDate()
            +" de "
            +(meses[dataAtual.getMonth()])
            +" de "
            +dataAtual.getFullYear()
            +", às "
            +(dataAtual.getHours() >= 10 ? dataAtual.getHours() : "0"+dataAtual.getHours())
            +":"
            +(dataAtual.getMinutes() >= 10 ? dataAtual.getMinutes() : "0"+dataAtual.getMinutes())
        );

        // resetar os dados anteriores.
        $graficoRoda.find(".vetor").removeClass('ponto-1 ponto-2 ponto-3');
        $resultadoParticipantes.find("tbody tr:not(.template)").remove();
        $resultadoPerguntas.find(".pergunta:not(.template)").remove();



        var $sohPerguntas = $secoesFormulario.filter(".pergunta");
        // console.log($sohPerguntas.length+" perguntas pra analisar");

        var resultadoAvaliacao = {};

        $graficoRoda.find(".eixo").each(function(index, el) {
            var total = parseInt($(el).find(".total").text());;
            resultadoAvaliacao[$(el).attr("id")] = {
                total: 0,
                pontos: 0
            };
            
            resultadoAvaliacao[$(el).attr("id")]["total"] = total;
        });

        // console.log(resultadoAvaliacao);

     

        $sohPerguntas.each(function(index, el) {
            var nEixo = parseInt($(el).attr("id").substr(1,1));
            var nVetor = parseInt($(el).attr("id").substr(3,2));
            // console.log("pergunta atual: eixo "+nEixo+", vetor "+nVetor);
            var $opcoesPergunta = $(el).find("fieldset.grupo input[type='radio']");
            var indexEscolhida = $opcoesPergunta.index($opcoesPergunta.filter(":checked"));
            // console.log("nessa pergunta, foi escolhida a "+(indexEscolhida+1)+"ª opção");
            $graficoRoda.find("#vetor"+nVetor).addClass('ponto-'+(indexEscolhida+1));
            resultadoAvaliacao["eixo"+nEixo]["pontos"] += (indexEscolhida+1);


            var $clonePerguntaRespondida = $resultadoPerguntas.find(".pergunta.template").clone();
            $clonePerguntaRespondida
            .removeClass('template')
            .children("h1.eixo")
            .text($(el).find("h1").text())
            .end()
            .children("h2.vetor")
            .text($(el).find("h2.vetor").text())
            .end()
            .children(".justificativa")
            .html($(el).find(".input_justificativa").val().replace(/\n\r?/g, '<br />'))
            .end()
            .children(".evidencias")
            .html($(el).find(".input_evidencias").val().replace(/\n\r?/g, '<br />'));

            if ($(el).find(".enunciado-eixo").length > 0) {
                $clonePerguntaRespondida
                .find("p.enunciado")
                .text($(el).find(".enunciado-eixo").text());
            }
            else{
                $clonePerguntaRespondida.find("p.enunciado").remove();
            }

            $(el).find("fieldset.grupo label").each(function(index, el) {
                var $opcaoRespondida = $("<li></li>");
                $opcaoRespondida.text($(el).find("p").text());
                if ($(el).find("input").is(":checked")) {
                    $opcaoRespondida.addClass('escolhida');
                }
                $clonePerguntaRespondida
                .find(".opcoes")
                .append($opcaoRespondida);
            });

            $resultadoPerguntas.append($clonePerguntaRespondida);


        });

        var somaTodasPorcentagens = 0;

        $graficoRoda.find(".eixo").each(function(index, el) {

            var chamadaResultadosAval = resultadoAvaliacao[$(el).attr("id")];
            var porcentagemEixo = (chamadaResultadosAval["pontos"]/chamadaResultadosAval["total"]*100).toFixed(2);

            somaTodasPorcentagens += parseFloat(porcentagemEixo);
            // console.log(somaTodasPorcentagens);
            $(el)
            .find(".pontos")
            .text(chamadaResultadosAval["pontos"])
            .end()
            .find(".porcentagem")
            .text(porcentagemEixo+"%");
        });

        $graficoRoda.find(".total .numero").text((somaTodasPorcentagens/($graficoRoda.find(".eixo").length)).toFixed(2)+"%");

        $resultadoInstituicao.find("p").each(function(index, el) {
            $(el).text(
                $("#inscricao-instituicao")
                .find("input")
                .filter(function(index) {
                    return $(this).attr('data-nome') === $(el).attr("data-for");
                })
                .val()
            );
        });

        $resultadoParticipantes.find("table tbody").each(function(index, el) {
            var $thisTabelaParticipantes = $(el);
            var $listaPreenchida = 
                $("#inscricao-participantes .participantes")
                .filter(function(index) {
                    return $(this).attr("data-nome") === $thisTabelaParticipantes.parent().attr("data-for");
                })
                .find("li.grupo");
            $listaPreenchida.each(function(index, el) {
                var $thisItemPreenchido = $(el);
                var $cloneParticipante = $thisTabelaParticipantes.find("tr.template").clone();
                $cloneParticipante
                .removeClass("template")
                .find("td")
                .each(function(index, el) {
                    $(el).text($thisItemPreenchido.find("input").filter(function(index) {
                        return $(this).attr("data-nome") === $(el).attr("data-for");
                    })
                    .val()
                    )
                });
                $thisTabelaParticipantes.append($cloneParticipante);
            });
        });


        $("#formulario").removeClass('visivel');
        $("#resultado").addClass('visivel');
    });

    $btSalvar.on('click', function(event) {
        
        localStorage.removeItem("avalEscolasMedicas__INSTITUICAO");
        localStorage.removeItem("avalEscolasMedicas__PARTICIPANTES");
        localStorage.removeItem("avalEscolasMedicas__PERGUNTAS");
        window.print();

    });

    $btRevisar.on('click', function(event) {
        $("#formulario").addClass('visivel');
        $("#resultado").removeClass('visivel');
    });


     $(document).on('keyup', function(event) {
        if (event.which === 192 && event.altKey && event.shiftKey) {
            event.preventDefault();
            cheatPreencherTudo();
        } else if(event.which === 82 && event.altKey && event.shiftKey){
            event.preventDefault();
            $btResultado.trigger("click");
        } else if(event.which === 39){
            $secoesFormulario.eq(perguntaAtual).find(".bt-avancar").trigger('click');
        } else if(event.which === 37){
            $secoesFormulario.eq(perguntaAtual).find(".bt-voltar").trigger('click');
        }
    });

}); 





