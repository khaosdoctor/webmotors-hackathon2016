/* Functions */
function getParameterByName(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function getAvg(){
  var models = "",
      ids = new Array();
  for(var i = 0; i < 5; i++){
    var model = $("#item"+i).attr('model');
    if(i == 0){
      models += "'"+model+"'";
    }
    else{
        models += ", '"+model+"'";
    }
    ids[i] = model;
  }
  $.ajax({
    url: "http://54.165.205.87:8088/mysql",
    contentType: 'application/json',
    dataType: "json",
    processData: false,
    method: "POST",
    data: JSON.stringify({"query": "SELECT NM_VCH_Modelo as modelo, ROUND(AVG(VL_NUM_Venda),2) as media from estoque_carros WHERE NM_VCH_Modelo IN ("+models+") GROUP BY modelo"}),
    success: function(data){
      for(var i = 0; i < data.length; i++){
        var count = 0,
            j = 0;
        while(count < 1){
          if(ids[j] === data[i].modelo){
            //$("#price"+i).html(data[i].media);
            count++;
          }
          else{
            j++;
          }
        }
      }
    }
  });
}
/* Functions */

$(document).ready(function () {

  var fingerprint = window.localStorage.getItem("fingerprint");
  if (!fingerprint) {
    new Fingerprint2().get(function (result, components) {
      window.localStorage.setItem("fingerprint", result);
      fingerprint = result;
    });
  }

  /* Masks */
  $('.money').maskMoney({
    prefix: 'R$ ',
    allowNegative: true,
    thousands: '.',
    decimal: ',',
    affixesStay: true
  });
  /* Masks */

  /* Ajax Filter */
  if($('#brand').length > 0){
    var brand = "<option disabled='' selected=''>MARCA</option>",
        models = new Array();
    $.ajax({
        url: "http://54.165.205.87:8088/mysql",
        contentType: 'application/json',
        dataType: "json",
        processData: false,
        method: "POST",
        data: JSON.stringify({"query":"SELECT marca FROM catalogo_carros GROUP BY marca"}),
        success: function(data){
          for(var i = 0; i < data.length ; i++){
            var string = "<option value='"+data[i].marca+"'>"+data[i].marca+"</option>";
            models.push(data[i].marca);
            brand += string;
          };
          $("#brand").html(brand);
        }
    });

    $("#brand").on('change', function(){
      $.ajax({
          url: "http://54.165.205.87:8088/mysql",
          contentType: 'application/json',
          dataType: "json",
          processData: false,
          method: "POST",
          data: JSON.stringify({"query":"SELECT modelo FROM catalogo_carros WHERE marca='"+$('#brand').val()+"' GROUP BY modelo"}),
          success: function(data){
            var model = "<option disabled='' selected=''>MODELO</option>";
            for(var i = 0; i < data.length ; i++){
              var string = "<option value='"+data[i].modelo+"'>"+data[i].modelo+"</option>";
              model += string;
            };
            $("#model").html(model);
          }
      });
      $("#year1").html("<option disabled='' selected=''>ANO DE:</option>");
      $("#year2").html("<option disabled='' selected=''>ANO ATÉ:</option>");
    });

    $("#model").on('change', function(){
      $("#year1").hide();
      $("#loader1").show();
      $("#year2").hide();
      $("#loader2").show();
      $.ajax({
          url: "http://54.165.205.87:8088/mysql",
          contentType: 'application/json',
          dataType: "json",
          processData: false,
          method: "POST",
          data: JSON.stringify({"query":"SELECT DT_INT_AnoModelo as year FROM estoque_carros WHERE NM_VCH_Modelo = '"+$("#model").val()+"' GROUP BY year"}),
          success: function(data){
            var year1 = "<option disabled='' selected=''>ANO DE:</option>",
                year2 = "<option disabled='' selected=''>ANO ATÉ:</option>";
            for(var i = 0; i < data.length ; i++){
              var string = "<option value='"+data[i].year+"'>"+data[i].year+"</option>";
              year1 += string;
              year2 += string;
            };
            $("#year1").html(year1);
            $("#year2").html(year2);
            $("#loader1").hide();
            $("#year1").show();
            $("#loader2").hide();
            $("#year2").show();
          }
      });
    });

    $("#year1").on('change', function(){
      $("#year2").hide();
      $("#loader2").show();
      $.ajax({
          url: "http://54.165.205.87:8088/mysql",
          contentType: 'application/json',
          dataType: "json",
          processData: false,
          method: "POST",
          data: JSON.stringify({"query":"SELECT DT_INT_AnoModelo as year FROM estoque_carros WHERE NM_VCH_Modelo = '"+$("#model").val()+"' AND DT_INT_AnoModelo >= '"+$("#year1").val()+"' GROUP BY year"}),
          success: function(data){
            var year2 = "<option disabled='' selected=''>ANO ATÉ:</option>";
            for(var i = 0; i < data.length ; i++){
              var string = "<option value='"+data[i].year+"'>"+data[i].year+"</option>";
              year2 += string;
            };
            $("#year2").html(year2);
            $("#loader2").hide();
            $("#year2").show();
          }
      });
    });

    /* Ajax Related */
    $.ajax({
        url: "http://54.165.205.87:8088/"+window.localStorage.getItem('fingerprint')+"/carros⁠⁠⁠⁠",
        contentType: 'application/json',
        dataType: "json",
        processData: false,
        method: "GET",
        success: function(data){
          var html = "";
          console.log(data);
          for(var i = 0; i < data.length; i++){
            if(data.length == 1){
              var item = '<div class="col-lg-3 col-md-3 col-sm-6 col-xs-12 col-centered"><div class="related-item" id="related-item'+i+'"><a href="single.html?id='+data[i].CD_NUM_Anuncio+'"><figure><img class="img-responsive" src="assets/img/img.jpg" alt="Car" title="Car"></figure></a><a href="single.html?id='+data[i].CD_NUM_Anuncio+'"><h3>'+data[i].NM_VCH_Marca+' - '+data[i].NM_VCH_Modelo+'</h3></a><a href="single.html?id='+data[i].CD_NUM_Anuncio+'"><h4>'+data[i].NM_VCH_Versao+'</h4></a><p>R$ '+data[i].VL_NUM_Venda+'</p></div></div>';
            }
            if(data.length == 2 && i == 0){
              var item = '<div class="col-lg-3 col-lg-offset-3 col-md-3 col-md-offset-3 col-sm-6 col-sm-offset-0 col-xs-12"><div class="related-item" id="related-item'+i+'"><a href="single.html?id='+data[i].CD_NUM_Anuncio+'"><figure><img class="img-responsive" src="assets/img/img.jpg" alt="Car" title="Car"></figure></a><a href="single.html?id='+data[i].CD_NUM_Anuncio+'"><h3>'+data[i].NM_VCH_Marca+' - '+data[i].NM_VCH_Modelo+'</h3></a><a href="single.html?id='+data[i].CD_NUM_Anuncio+'"><h4>'+data[i].NM_VCH_Versao+'</h4></a><p>R$ '+data[i].VL_NUM_Venda+'</p></div></div>';
            }
            if(data.length == 2 && i > 0){
              var item = '<div class="col-lg-3 col-md-3 col-sm-6 col-xs-12"><div class="related-item" id="related-item'+i+'"><a href="single.html?id='+data[i].CD_NUM_Anuncio+'"><figure><img class="img-responsive" src="assets/img/img.jpg" alt="Car" title="Car"></figure></a><a href="single.html?id='+data[i].CD_NUM_Anuncio+'"><h3>'+data[i].NM_VCH_Marca+' - '+data[i].NM_VCH_Modelo+'</h3></a><a href="single.html?id='+data[i].CD_NUM_Anuncio+'"><h4>'+data[i].NM_VCH_Versao+'</h4></a><p>R$ '+data[i].VL_NUM_Venda+'</p></div></div>';
            }
            if(data.length == 3){
              var item = '<div class="col-lg-4 col-md-4 col-sm-6 col-xs-12"><div class="related-item" id="related-item'+i+'"><a href="single.html?id='+data[i].CD_NUM_Anuncio+'"><figure><img class="img-responsive" src="assets/img/img.jpg" alt="Car" title="Car"></figure></a><a href="single.html?id='+data[i].CD_NUM_Anuncio+'"><h3>'+data[i].NM_VCH_Marca+' - '+data[i].NM_VCH_Modelo+'</h3></a><a href="single.html?id='+data[i].CD_NUM_Anuncio+'"><h4>'+data[i].NM_VCH_Versao+'</h4></a><p>R$ '+data[i].VL_NUM_Venda+'</p></div></div>';
            }
            if(data.length == 4){
              var item = '<div class="col-lg-3 col-md-3 col-sm-6 col-xs-12"><div class="related-item" id="related-item'+i+'"><a href="single.html?id='+data[i].CD_NUM_Anuncio+'"><figure><img class="img-responsive" src="assets/img/img.jpg" alt="Car" title="Car"></figure></a><a href="single.html?id='+data[i].CD_NUM_Anuncio+'"><h3>'+data[i].NM_VCH_Marca+' - '+data[i].NM_VCH_Modelo+'</h3></a><a href="single.html?id='+data[i].CD_NUM_Anuncio+'"><h4>'+data[i].NM_VCH_Versao+'</h4></a><p>R$ '+data[i].VL_NUM_Venda+'</p></div></div>';
            }

            html += item;
          }
          if(html !== ""){
            $('main .related').show();
            $('#relateds').html(html);
          }
        }
    });
    /* Ajax Related */
  }
  /* Ajax Filter */

  /* Ajax Submit Form */
  $('#search').on('submit', function(e) {
    e.preventDefault();
    var data = $(this).serialize().split('&'),
        min = $('input[name="pricemin"]').maskMoney('unmasked'),
        max = $('input[name="pricemax"]').maskMoney('unmasked'),
        keywords = $('input[name="keywords"]').val().toUpperCase().split(' '),
        query = "SELECT CD_NUM_Anuncio as cod, NM_VCH_Marca as marca, NM_VCH_Modelo as modelo, NM_VCH_Versao as versao, TP_CHR_Anuncio as anuncio, VL_NUM_Venda as valor, NR_INT_Km as km, DT_INT_AnoModelo as anoModel, DT_INT_AnoFabricacao as anoFab, NM_CHR_Uf as state FROM estoque_carros WHERE ST_CHR_Anuncio = 'A' ";
        obj = {
          novo : null,
          usado : null,
          marca : null,
          modelo : null,
          anoInicial : null,
          anoFinal : null,
          palavras : ((keywords[0] !== "") ? keywords : null),
          precoMin : ((min[0] > 0) ? min[0] : null),
          precoMax : ((max[0] > 0) ? max[0] : null),
          regiao : null
        };

    /* Populando Obj */
    for(var i = 0; i < data.length; i++){
      var regex = /=(.+)/.exec(data[i]),
          regexCompare = /(.+)=/.exec(data[i]);
      if(regex !== null){
        switch (regexCompare[1]){
          case "TipoAnuncioN":
            obj.novo = regex[1];
            break;
          case "TipoAnuncioU":
            obj.usado = regex[1];
            break;
          case "brand":
            obj.marca = decodeURIComponent(regex[1]);
            break;
          case "model":
            obj.modelo = decodeURIComponent(regex[1]);
            break;
          case "year1":
            obj.anoInicial = regex[1];
            break;
          case "year2":
            obj.anoFinal = regex[1];
            break;
          case "state":
            obj.regiao = regex[1];
            break;
        }
      }
    };
    /* Populando Obj */

    /* Motando Query */
      if((obj.novo == null && obj.usado !== null) || (obj.novo !== null && obj.usado == null)){
        if(obj.novo == null){
          query += "AND TP_CHR_Anuncio = '"+obj.usado+"' ";
        }
        if(obj.usado == null){
          query += "AND TP_CHR_Anuncio = '"+obj.novo+"' ";
        }
      }

      if(obj.marca !== null){
        query += "AND NM_VCH_Marca = '"+obj.marca+"' ";

        if(obj.modelo !== null){
          query += "AND NM_VCH_Modelo = '"+obj.modelo+"' ";

          if(obj.anoInicial !== null){
            query += "AND DT_INT_AnoModelo >= "+obj.anoInicial+" ";

            if(obj.anoFinal !== null){
                query += "AND DT_INT_AnoModelo <= "+obj.anoFinal+" ";
            }
          }
        }
      }

      if(obj.precoMin !== null){
        query += "AND VL_NUM_Venda >= "+obj.precoMin+" ";
      }

      if(obj.precoMax !== null){
        query += "AND VL_NUM_Venda <= "+obj.precoMax+" ";
      }

      if(obj.regiao !== null){
        query += "AND NM_CHR_Uf = '"+obj.regiao+"' ";
      }

      if(obj.palavras !== null){
        for(var i = 0; i < obj.palavras.length; i++){
          if(obj.palavras[i] !== undefined){
            query += "AND NM_VCH_Versao LIKE '%"+obj.palavras[i]+"%' ";
          }
        }
      }
    /* Motando Query */

    /* Ajax */
    $('.itens').html('<img src="assets/img/loader.gif" class="img-responsive" title="loader" alt="loader" style="margin: 0 auto;">');
    $.ajax({
        url: "http://54.165.205.87:8088/mysql",
        contentType: 'application/json',
        dataType: "json",
        processData: false,
        method: "POST",
        data: JSON.stringify({"query": query+" LIMIT 10"}),
        success: function(data){
          var html = '';
          for(var i = 0; i < data.length; i++){
            var item = '<div class="item" id="item'+i+'" bd="'+data[i].cod+'" model="'+data[i].modelo+'"><div class="row"><div class="col-lg-6 col-md-6 col-sm-12 col-xs-12"><a href="single.html?id='+data[i].cod+'"><figure><img class="img-responsive" src="assets/img/img.jpg" alt="Cars" title="Cars"></figure></a></div><div class="col-lg-6 col-md-6 col-sm-12 col-xs-12"><div class="text"><a href=single.html?id="'+data[i].cod+'"><h3>'+data[i].marca+' - '+data[i].modelo+'</h3></a><a href=single.html?id="'+data[i].cod+'"><h4>'+data[i].versao+'</h4></a><p>R$ '+data[i].valor+'</p><hr><div class="row"><div class="col-lg-6 col-md-6 col-sm-12 col-xs-12"><span>'+data[i].anoFab+'/'+data[i].anoModel+'</span></div><div class="col-lg-6 col-md-6 col-sm-12 col-xs-12"><span>'+data[i].km+' KM</span></div></div><hr><h5>'+data[i].state+'</h5></div></div></div></div>';
            html += item;
          }
          $('main .result h2').show();
          $('.itens').html(html);
          /*for(var i = 0; i < data.length; i++) {
              $("main .result #item"+i+" figure").append("<div class='price' id='price"+i+"'></div>");
          }*/
        }
    }).done(function(){
      //getAvg();
    });
    /* Ajax */
  });
  /* Ajax Submit Form */

  /* Ajax Single */
  if(getParameterByName('id') !== null){
    $('#content').hide();
    $.ajax({
        url: "http://54.165.205.87:8088/mysql",
        contentType: 'application/json',
        dataType: "json",
        processData: false,
        method: "POST",
        data: JSON.stringify({"query": "SELECT CD_NUM_Anuncio as cod, NM_VCH_Marca as marca, NM_VCH_Modelo as modelo, NM_VCH_Versao as versao, TP_CHR_Anuncio as anuncio, VL_NUM_Venda as valor, NR_INT_Km as km, DT_INT_AnoModelo as anoModel, DT_INT_AnoFabricacao as anoFab, NM_CHR_Uf as state FROM estoque_carros WHERE CD_NUM_Anuncio = "+getParameterByName('id')}),
        success: function(data){
          $('main .content h1').html(data[0].marca+" - "+data[0].modelo);
          $('main .content h2').html(data[0].versao);
          $('main .content .money').html("<span>Valor: </span>R$ "+data[0].valor);
          $('main .content .car-year').html("<span>Ano: </span> "+data[0].anoFab+"/"+data[0].anoModel);
          $('main .content .car-km').html("<span>Kilometragem: </span> "+data[0].km+" KM");
          $('#loader-page').hide();
          $('#content').fadeIn();
        }
    });
    //Insere na hora que clica no anuncio
    $.ajax({
      url: "http://54.165.205.87:8088/" + window.localStorage.getItem('fingerprint'),
      contentType: 'application/json',
      dataType: "json",
      processData: false,
      method: "POST",
      data: JSON.stringify({ "value": getParameterByName("id").replace('"','').replace('"','')}),
      success: function (data) {
        //console.log(data);
        console.log("Inserido no localStorage");
      }
    })
  }
  /* Ajax Single */
});
