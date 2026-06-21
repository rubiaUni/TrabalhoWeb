$("btnGravar").on("click", function() {

    $.ajax({
    url: "/api/cadastra_productos",
    type: "POST",
    dataType: "json",
    data: {
      id: $("#id").val(), //????
      brand:$("#brand").val(),
      line:$("#line").val(),
      model:$("#model").val(),
      processor:$("#processor").val(),
      threads:$("#threads").val(),
      ram:$("#ram").val(),
      maxcap:$("#maxcap").val(),
      storage:$("#storage").val(),
      graphicCard:$("#graphicCard").val(),
      display:$("#display").val(),
      operationalSystem:$("#operationalSystem").val(),
      price:$("#price").val(),
      timestamp:Date.now()//$("#timestamp").val(),
  //id                Int      @id @default(autoincrement())


  //timestamp DateTime @default(now())


  },
  success: function( result ) {
    //mensagem de sucesso?
  }


});
});+


$("btnConsultar").on("click", function() {
  $.ajax({
    url: "/api/consulta_produtos",
    type: "GET",
    dataType: "json", 

    data: { 
    id: $("#myTextBox").val(),
  },
    success: function(response) {
        //console.log("Data successfully retrieved", response);??
      $("#id").val(response.id), //????
      $("#brand").val(response.brand),
      $("#line").val(response.line),
      $("#model").val(response.model),
      $("#processor").val(response.processor),
      $("#threads").val(response.threads),
      $("#ram").val(response.ram),
      $("#maxcap").val(response.maxcap),
      $("#storage").val(response.storage),
      $("#graphicCard").val(response.graphicCard),
      $("#display").val(response.display),
      $("#operationalSystem").val(response.operationalSystem),
      $("#price").val(response.price),
      $("#timestamp").val(response.timestamp)

    }
  });
});



