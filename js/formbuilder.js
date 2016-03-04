(function(){
  
  this.FormBuilder = function(){
    
    var defaults = {
        url: "",
        content: ""
    };
    var constants = {
      MIN_FORM: 1
    }
    this.options = extendDefaults( defaults, arguments[0] );
    this.constants = constants;
    loadFile(this);
  }
  
  function extendDefaults(source, properties) {
    var property;
    for (property in properties) {
      if (properties.hasOwnProperty(property)) {
        source[property] = properties[property];
      }
    }
    return source;
  }
  
  function loadFile(formB){
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", formB.options.url, true);
    xhttp.send();
    
    xhttp.onreadystatechange = function() {
      if (xhttp.readyState == 4 && xhttp.status == 200){
        compileFile(formB, xhttp.responseText);
      }
      if (xhttp.readyState == 4 && xhttp.status == 404){
        alert("Error load File");
      }
    };
    
  }
  
  function compileFile(formB, file){
    //Logic build
    /* \n : , = # double-space*/
    
    var res;
    var rows = file.split("\n")
    rows = emptyRow(rows);
    res = verifyElements(rows);
    if(res){
      alert(res);
    }else{
      buildForm(formB, rows);
    }
  }
  
  function verifyElements(rows){
    var res = false;
    for(var i = 0; i < rows.length; i++){
      var data = extractElement(rows[i]);
      var nameElement = data[0];
      var attrs = data[1];
      
      if ( !isElement(nameElement) ) {
        res = 'Element ' + nameElement + ' not exists.';
        break;
      }
      if ( (resp = verifyAttrs(nameElement, attrs)) !== true ) {
        res = "Attributes: " + resp + ", are required.";
        break;
      }
    }
    
    if(!res){
      
    }
    
    return res;
  }
  
  function extractElement(row){
    var data = row.split(':');
    var nameElement = data[0].trim();
    var attrs = data[1];
    if( typeof attrs !== 'undefined' ){
      attrs = attrs.split(',');  
    }else{
      attrs = [];
    }
    return [nameElement, attrs];
  }
  
  function buildForm(formB, rows){
    var container = document.querySelector(formB.options.content);
    var form;
    var arrayElements = [];
    for(var i = 0; i < rows.length; i++){
      
      var level = getLevelElement(rows[i]);
      var data = extractElement(rows[i]);
      var nameElement = data[0];
      var attrs = data[1];
      var el = document.createElement(nameElement);
      arrayElements[level] = el;
      
      for(var j = 0; j < attrs.length; j++){
        var attr = attrs[j].split('=');
        var name = attr[0];
        var val = attr[1];
        el.setAttribute(name.trim(), val.trim());
      }
      var res = manageElement(container, arrayElements, el, level);
    }
  }
  
  function manageElement(container, arrayElements, element, level){
    
    //Exceptions
    //1: si aun no ha sido creado el elemento padre para el elemento en memoria
    if(level == 0){
      container.appendChild(element);
      return;
    }
    var level_parent = level - 1;
    if (typeof arrayElements[level_parent] !== 'undefined'){
      arrayElements[level_parent].appendChild(element);
      return true;
    }else{
        return false;
    }
  }
  
  function getLevelElement(row){
    row = row.replace(/\s{2}/g, "\t");
    var patt = new RegExp("^\\t+");
    var res = patt.exec(row);
    
    var spaces = (res !== null)? res[0].length : 0;
    return spaces;
  }
  
  function isElement(el){
    var ar = ["form", "panel", "input"];
    
    //"hidden", "text", "tel", "textarea", "date", "number", "password"
    return ( ar.indexOf(el.trim()) !== -1);
  }
  
  function verifyAttrs(element, attrs){
    var ar = {
      "form": ["action", "method"],
      "input": ["type", "id", "label"],
      "panel": []
    };
    
    var attrs_required = eval( "ar."+element );
    
    for(var i = 0; i < attrs.length; i++){
      if( attrs_required.length > 0){
        var at = attrs[i].split("=");
        if( (index = attrs_required.indexOf(at[0].toLowerCase().trim())) !== -1 ){
          attrs_required.splice(index, 1);
        }  
      }else
        break;
    }
    return (attrs_required.length === 0)? true : attrs_required.join();
      
  }
  
  function emptyRow(rows){
    var nrows = [];
    for(var i = 0; i < rows.length; i++){
      if(!/^\s*$/.test(rows[i]))
        nrows.push(rows[i]);
    }
    return nrows;
  }
  
  function isArray(data){
    return ( Object.prototype.toString.call( someVar ) === '[object Array]' );
  }
  
  
  
  
}());