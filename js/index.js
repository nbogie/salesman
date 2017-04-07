var gWords = null;
var gCustomers = null;


var publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/15U4k_wcpe-DK4-TTeA4I9Rq2JY1aMqLRo6oQh2A2Urs/pubhtml'

function init() {
  Tabletop.init( { key: publicSpreadsheetUrl,
                  callback: handleResponse
                  } );

  
  [1,2,3,4,5,6].forEach(function(i) {  
    var tag = $('#word' + i);
    tag.click(function() {
      replaceWithNewWord(gWords, tag);
    });
  });

  $('#customer').click(function() {
    replaceWithNewWord(gCustomers, $('#customer'));
  });

  
  $('#randomise').click(randomise);

}


function handleResponse(data, tabletop) {
  
  gWords = tabletop.sheets('words').elements;
  gCustomers = tabletop.sheets('customers').elements;
  
  
  setNames = _.union(_.map(gWords, function(entry){ 
    return entry.pack; 
  }));
  
  setNames.forEach(function(si) {
    $("<option/>").val(si).text(si).appendTo("#set-select");
  });
  randomise();
}

function classForPack(packName, defaultClass) {
  alloweds = "original exp1 exp2 rpgnet idea neill".split(' ');
  var ix = alloweds.indexOf(packName);
  return (ix >= 0) ? alloweds[ix] : defaultClass;
}

function placeWordIn(w, tag) {
  tag.html(w.title + " ");
  tag.removeClass();
  tag.addClass(classForPack(w.pack, 'noPack'));
}

function replaceWithNewWord(list, tag){
  var w = _.sample(list);
  placeWordIn(w, tag);
}

function randomise() {
  setName = $('#set-select').val();  
  function getSet(packName) {
    return  _.filter(gWords, function(entry){ 
      return entry.pack == packName;
    });
  }
  partition = _.partition(gWords, function(entry){ 
    return entry.interesting == "y";
  });
  interestingWords = partition[0];
  mundaneWords = partition[1];
  
  cust = _.sample(gCustomers);
  words = _.sample(gWords, 5).concat(_.sample(interestingWords, 1));
  for (var i = 0; i < 6; i++) {
    placeWordIn(words[i], $('#word'+(i+1)));
  }

  $('#customer').html(cust.title).
    removeClass().
    addClass(classForPack(cust.pack, 'noPack'));
}

window.addEventListener('DOMContentLoaded', init)
