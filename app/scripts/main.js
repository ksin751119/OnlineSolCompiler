 window.addEventListener('load', function() {
  doGetCompilers();
});


/**
 * This populates all <SELECT> boxes with accounts
 */
function  addCompileVersionsToSelects(soljsonReleases){
    removeAllChildItems('select_to_compile_version');
    for (var i = 0; i < Object.keys(soljsonReleases).length; i++) {
      var compilerVersion = soljsonReleases[_.keys(soljsonReleases)[i]];
      addOptionToSelect('select_to_compile_version', compilerVersion, compilerVersion);
    }
}

/**
 * Removes all of the <li> in List
 */
function removeAllChildItems(elementId){
    var ele = document.getElementById(elementId);
    while (ele.hasChildNodes()) {
        ele.removeChild(ele.firstChild);
    }
}

/**
 * Add options to a <select>
 */
function addOptionToSelect(selectId, text, value){
    var option = document.createElement('OPTION');
    option.text = text;
    option.value = value;
    var select = document.getElementById(selectId);
    select.appendChild(option);
}

/**
 * Gets the list of compilers
 */
function doGetCompilers()  {
  BrowserSolc.getVersions(function(soljsonSources, soljsonReleases) {
  addCompileVersionsToSelects(soljsonReleases);
  });
}

/**
 * Compile solidity code and get abi and bytecode from only sloc
 */
function    doCompileSolidityContract()  {
    console.log(document.getElementById('select_to_compile_version'));
    var compilerVersion = document.getElementById('select_to_compile_version').value;
    // Clen output field
    document.getElementById('compiled_bytecode').value='';
    document.getElementById('compiled_abidefinition').value='';
    document.getElementById('layout').style.display = 'block';

    //console.log(source);
    window.BrowserSolc.loadVersion(compilerVersion, function(c) {
      var compiler = c;
      console.log('Solc Version Loaded: ' + compilerVersion);

      var source = document.getElementById('sourcecode').value;
      var result = compiler.compile(source, 1);

      if(result.errors && JSON.stringify(result.errors).match(/error/i)){

          console.log(result.errors);
          setData('compilation_result',result.errors,true);
      } else {
          var thisMap = _.sortBy(_.map(result.contracts, function(val,key) {
              return [key,val];
          }), function(val) {
              return -1*parseFloat(val[1].bytecode);
          });

          console.debug(thisMap);
          var abi = JSON.parse(thisMap[0][1].interface);
          var bytecode = '0x' + thisMap[0][1].bytecode;
          document.getElementById('compiled_bytecode').value=bytecode;
          document.getElementById('compiled_abidefinition').value=JSON.stringify(abi);
          document.getElementById('layout').style.display = 'none';
      }
  });
}


function showLoading()
{

}
